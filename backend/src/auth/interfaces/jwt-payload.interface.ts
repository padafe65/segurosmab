import { ValidRoles } from "./valid-roles";


export interface Payload{

    id_user: number,
    email: string,
    roles: ValidRoles[]

}