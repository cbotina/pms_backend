import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

/** Return type of `admin.storage().bucket(...)` — not the `bucket` method itself. */
type FirebaseStorageBucket = ReturnType<
  ReturnType<typeof admin.storage>['bucket']
>;

@Injectable()
export class FirebaseAdminService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseAdminService.name);
  private firebaseAuth: admin.auth.Auth | null = null;
  private storageBucket: FirebaseStorageBucket | null = null;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit(): void {
    const json = this.configService.get<string>('firebaseServiceAccountJson');
    if (!json?.trim()) {
      return;
    }
    try {
      const credential = JSON.parse(json) as admin.ServiceAccount;
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert(credential),
          storageBucket: this.configService.get<string>('firebaseStorageBucket'),
        });
      }
      this.firebaseAuth = admin.auth();
      const bucket = this.configService.get<string>('firebaseStorageBucket');
      if (bucket) {
        this.storageBucket = admin.storage().bucket(bucket);
      }
    } catch (e) {
      this.logger.error('Firebase Admin initialization failed', e);
      this.firebaseAuth = null;
    }
  }

  /**
   * Returns null when Firebase is not configured or initialization failed.
   */
  async createCustomToken(
    userId: number,
    claims: { role: string; entityId?: number | null },
  ): Promise<string | null> {
    if (!this.firebaseAuth) {
      return null;
    }
    const uid = `user_${userId}`;
    const additionalClaims: Record<string, string | number> = {
      role: claims.role,
    };
    if (claims.entityId != null) {
      additionalClaims.entityId = claims.entityId;
    }
    return this.firebaseAuth.createCustomToken(uid, additionalClaims);
  }

  /**
   * Generates a short-lived signed read URL for a Firebase Storage object.
   * Returns null when Firebase is not configured or the bucket is unavailable.
   */
  async getSignedReadUrl(
    objectPath: string,
    expiresInMinutes = 30,
  ): Promise<string | null> {
    if (!this.storageBucket) return null;
    try {
      const file = this.storageBucket.file(objectPath);
      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + expiresInMinutes * 60 * 1000,
      });
      return url;
    } catch (e) {
      this.logger.error(`Failed to generate signed URL for ${objectPath}`, e);
      return null;
    }
  }
}
