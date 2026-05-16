import {
  BadRequestException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

@Injectable()
export class OpenaiService {
  private readonly logger = new Logger(OpenaiService.name);
  private readonly client: OpenAI | null;
  private readonly model: string;
  lastUsage: { promptTokens?: number; completionTokens?: number; model?: string } | null = null;

  constructor(private readonly configService: ConfigService) {
    const apiKey =
      this.configService.get<string>('openai.apiKey') ??
      process.env.OPENAI_API_KEY ??
      '';
    this.model =
      this.configService.get<string>('openai.model') ??
      process.env.OPENAI_MODEL ??
      'gpt-4o-mini';
    this.client = apiKey ? new OpenAI({ apiKey }) : null;
  }

  isConfigured(): boolean {
    return this.client !== null;
  }

  assertConfigured(): void {
    if (!this.client) {
      throw new BadRequestException(
        'OPENAI_API_KEY no está configurada en el servidor.',
      );
    }
  }

  async *streamChatCompletion(
    messages: ChatCompletionMessageParam[],
  ): AsyncGenerator<string> {
    this.assertConfigured();
    this.lastUsage = null;
    const stream = await this.client!.chat.completions.create({
      model: this.model,
      messages,
      stream: true,
      stream_options: { include_usage: true },
    });
    for await (const chunk of stream) {
      const piece = chunk.choices[0]?.delta?.content;
      if (piece) {
        yield piece;
      }
      if (chunk.usage) {
        this.lastUsage = {
          promptTokens: chunk.usage.prompt_tokens,
          completionTokens: chunk.usage.completion_tokens,
          model: this.model,
        };
      }
    }
  }

  async generateConversationTitle(
    userText: string,
    assistantPreview: string,
  ): Promise<string> {
    this.assertConfigured();
    const preview = assistantPreview.slice(0, 500);
    try {
      const res = await this.client!.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content:
              'Genera un título muy breve (máximo 6 palabras) para esta conversación académica. Solo el título, sin comillas ni puntuación final.',
          },
          {
            role: 'user',
            content: `Pregunta o mensaje del estudiante:\n${userText.slice(0, 400)}\n\nInicio de la respuesta del asistente:\n${preview}`,
          },
        ],
        max_tokens: 40,
        temperature: 0.4,
      });
      const raw = res.choices[0]?.message?.content?.trim() ?? '';
      return raw.slice(0, 120) || 'Conversación';
    } catch (e) {
      this.logger.warn(`generateConversationTitle failed: ${e}`);
      return 'Conversación';
    }
  }
}
