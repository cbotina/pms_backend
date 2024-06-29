import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    const checkPassword = compareSync(password, user.password);

    if (!checkPassword) {
      throw new UnauthorizedException('Wrong Password');
    }

    const payload = { id: user.id, role: user.role, entityId: user.entityId };
    const data = { token: this.jwtService.sign(payload) };

    return data;
  }
}
