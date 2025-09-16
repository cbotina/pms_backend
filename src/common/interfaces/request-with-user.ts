import { Request } from 'express';
import { User } from '@users/entities/user.entity';

export class RequestWithUser extends Request {
  user: User;
  params?: any;
}
