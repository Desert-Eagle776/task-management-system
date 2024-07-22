import { SetMetadata } from "@nestjs/common";
import { FamilyRoles } from "./roles.guard";

export const ROLES_KEY = 'roles';
export const Roles = (...roles: FamilyRoles[]) => SetMetadata(ROLES_KEY, roles);