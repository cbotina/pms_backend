import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { FirebaseAdminService } from 'src/firebase/firebase-admin.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private firebaseAdmin: FirebaseAdminService,
  ) {}

  async login(
    email: string,
    password: string,
  ): Promise<{ token: string; firebaseToken: string | null }> {
    const user = await this.usersService.findOneByEmail(email);
    const checkPassword = compareSync(password, user.password);

    if (!checkPassword) {
      throw new UnauthorizedException('Wrong Password');
    }

    const payload = {
      id: user.id,
      role: user.role,
      entityId: user.entityId,
      userId: user.id,
    };
    const token = this.jwtService.sign(payload);
    const firebaseToken = await this.firebaseAdmin.createCustomToken(user.id, {
      role: user.role,
      entityId: user.entityId ?? null,
    });

    return { token, firebaseToken };
  }

  async getFirebaseCustomToken(user: {
    id: number;
    role: string;
    entityId?: number | null;
  }): Promise<{ firebaseToken: string | null }> {
    const firebaseToken = await this.firebaseAdmin.createCustomToken(user.id, {
      role: user.role,
      entityId: user.entityId ?? null,
    });
    return { firebaseToken };
  }
}
