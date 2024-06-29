import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Roles } from 'src/users/entities/user.entity';
import { RequestWithUser } from '../interfaces/request-with-user';

@Injectable()
export class UserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: RequestWithUser = context.switchToHttp().getRequest();
    const { user } = request;
    const { id } = request.params;

    if (user.role === Roles.ADMIN) {
      return true;
    }

    return +id === user.id;
  }
}
