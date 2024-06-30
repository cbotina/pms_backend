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

    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    if (isPublic) {
      return true;
    }

    if (!requiredRole) {
      return true;
    }
    const request: RequestWithUser = context.switchToHttp().getRequest();
    const { user } = request;
    if (!user) {
      return false;
    }

    if ((user.role = Roles.ADMIN)) {
      return true;
    }

    return requiredRole == user.role;
  }
}
