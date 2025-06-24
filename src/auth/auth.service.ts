import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync, hash, compare } from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async login(email: string, password: string): Promise<TokenResponse> {
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

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('jwt.secret'),
      expiresIn: this.configService.get('jwt.accessTokenExpiresIn'),
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('jwt.refreshSecret'),
      expiresIn: this.configService.get('jwt.refreshTokenExpiresIn'),
    });
    await this.setRefreshToken(user.id, refreshToken);
    return { accessToken, refreshToken };
  }

  async setRefreshToken(userId: number, refreshToken: string): Promise<void> {
    const hashed = await hash(refreshToken, 10);
    await this.usersRepository.update(userId, { refreshToken: hashed });
  }

  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('jwt.refreshSecret'),
      });
      const user = await this.usersService.findOne(payload.id);
      if (!user || !user.refreshToken)
        throw new UnauthorizedException('Invalid refresh token');
      const isMatch = await compare(refreshToken, user.refreshToken);
      if (!isMatch) throw new UnauthorizedException('Invalid refresh token');
      // Issue new tokens
      const newPayload = {
        id: user.id,
        role: user.role,
        entityId: user.entityId,
        userId: user.id,
      };
      const accessToken = this.jwtService.sign(newPayload, {
        secret: this.configService.get('jwt.secret'),
        expiresIn: this.configService.get('jwt.accessTokenExpiresIn'),
      });
      const newRefreshToken = this.jwtService.sign(newPayload, {
        secret: this.configService.get('jwt.refreshSecret'),
        expiresIn: this.configService.get('jwt.refreshTokenExpiresIn'),
      });
      await this.setRefreshToken(user.id, newRefreshToken);
      return { accessToken, refreshToken: newRefreshToken };
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: number): Promise<{ message: string }> {
    await this.usersRepository.update(userId, { refreshToken: null });
    return { message: 'Logged out successfully' };
  }
}
