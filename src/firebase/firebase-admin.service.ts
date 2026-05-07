import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseAdminService implements OnModuleInit {
  private firebaseAuth: admin.auth.Auth | null = null;

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
        });
      }
      this.firebaseAuth = admin.auth();
    } catch (e) {
      console.error('Firebase Admin initialization failed', e);
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
}
