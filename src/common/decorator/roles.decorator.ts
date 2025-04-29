import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum';

// define a metadata key for storing roles
export const ROLES_KEY = 'roles';

// this is a custom decorator to attach roles metadata to route handlers
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
