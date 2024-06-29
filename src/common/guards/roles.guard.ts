import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './../decorators/roles.decorator';
import { Roles } from 'src/users/entities/user.entity';
import { RequestWithUser } from '../interfaces/request-with-user';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole: Roles = this.reflector.getAllAndOverride<Roles>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRole) {
      return true;
    }
    const request: RequestWithUser = context.switchToHttp().getRequest();
    const { user } = request;

    if ((user.role = Roles.ADMIN)) {
      return true;
    }

    if (!user) {
      return false;
    }

    return requiredRole == user.role;
  }
}
