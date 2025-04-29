import { Request } from 'express';
import { Role } from '../common/enums/role.enum';

export interface RequestWithUser extends Request {
  user: {
    userId: number;
    email: string;
    role: Role;
  };
}
