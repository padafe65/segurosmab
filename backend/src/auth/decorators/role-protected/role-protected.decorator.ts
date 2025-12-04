import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';

export const META_ROLES = 'ROLES'

export const RoleProtected = (...args: ValidRoles[]) => 
    SetMetadata(META_ROLES, args);


