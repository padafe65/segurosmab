import { ValidRoles } from './valid-roles';

export interface Payload {
  id: number;
  email: string;
  roles: ValidRoles[];
}
