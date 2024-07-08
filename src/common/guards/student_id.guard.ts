import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Roles } from 'src/users/entities/user.entity';

@Injectable()
export class StudentIdGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: any = context.switchToHttp().getRequest();
    const { user } = request;
    const { studentId } = request.params;

    console.log(studentId, user.entityId);

    if (user.role === Roles.ADMIN) {
      return true;
    }

    return studentId == user.entityId;
  }
}
