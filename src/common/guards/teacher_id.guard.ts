import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Roles } from 'src/users/entities/user.entity';

@Injectable()
export class TeacherIdGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: any = context.switchToHttp().getRequest();
    const { user } = request;
    const { teacherId } = request.params;

    console.log(teacherId, user.entityId);

    if (user.role === Roles.ADMIN) {
      return true;
    }

    return teacherId == user.entityId;
  }
}
