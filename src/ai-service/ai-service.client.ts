import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface IngestRequest {
  documentId: string;
  subjectGroupId: number;
  signedReadUrl: string;
}

export interface DocumentStatusResponse {
  status: 'processing' | 'ready' | 'failed';
  summary?: string;
  chunkCount?: number;
  error?: string;
}

export interface RetrievedChunk {
  documentId: string;
  content: string;
  pageNumber: number | null;
  section: string | null;
  relevanceScore: number;
}

export interface RetrieveResponse {
  chunks: RetrievedChunk[];
}

@Injectable()
export class AiServiceClient {
  private readonly logger = new Logger(AiServiceClient.name);
  private readonly baseUrl: string;
  private readonly secret: string;

  constructor(private readonly configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('PMS_AI_SERVICE_BASE_URL') ?? '';
    this.secret = this.configService.get<string>('PMS_AI_SERVICE_SECRET') ?? '';
  }

  get isConfigured(): boolean {
    return !!this.baseUrl && !!this.secret;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    timeoutMs = 10_000,
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-PMS-AI-Key': this.secret,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`AI service ${method} ${path} returned ${res.status}: ${text}`);
      }

      if (res.status === 204) return null as T;
      return (await res.json()) as T;
    } finally {
      clearTimeout(timer);
    }
  }

  async triggerIngest(req: IngestRequest): Promise<boolean> {
    if (!this.isConfigured) {
      this.logger.warn('AI service not configured — skipping ingest');
      return false;
    }
    try {
      await this.request('POST', '/internal/ingest', req);
      return true;
    } catch (e) {
      this.logger.error(`Ingest trigger failed: ${e.message}`);
      return false;
    }
  }

  async getDocumentStatus(documentId: string): Promise<DocumentStatusResponse | null> {
    if (!this.isConfigured) return null;
    try {
      return await this.request<DocumentStatusResponse>(
        'GET',
        `/internal/documents/${documentId}/status`,
        undefined,
        5_000,
      );
    } catch (e) {
      this.logger.error(`Status check failed for ${documentId}: ${e.message}`);
      return null;
    }
  }

  async retrieve(
    subjectGroupId: number,
    query: string,
    topK = 5,
  ): Promise<RetrievedChunk[]> {
    if (!this.isConfigured) return [];
    try {
      const res = await this.request<RetrieveResponse>(
        'POST',
        '/internal/retrieve',
        { subjectGroupId, query, topK },
        3_000,
      );
      return res.chunks;
    } catch (e) {
      this.logger.error(`Retrieve failed: ${e.message}`);
      return [];
    }
  }

  async deleteDocument(documentId: string): Promise<void> {
    if (!this.isConfigured) return;
    try {
      await this.request('DELETE', `/internal/documents/${documentId}`);
    } catch (e) {
      this.logger.error(`Delete failed for ${documentId}: ${e.message}`);
    }
  }
}
