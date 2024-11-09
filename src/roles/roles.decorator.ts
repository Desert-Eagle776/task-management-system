import { SetMetadata } from '@nestjs/common';
import { FamilyRoles } from 'src/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: FamilyRoles[]) => SetMetadata(ROLES_KEY, roles);
