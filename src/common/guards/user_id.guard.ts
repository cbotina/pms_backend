import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Roles } from 'src/users/entities/user.entity';

@Injectable()
export class UserIdGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: any = context.switchToHttp().getRequest();
    const { user } = request;
    const { userId } = request.params;

    if (user.role === Roles.ADMIN) {
      return true;
    }

    return userId == user.entityId;
  }
}
