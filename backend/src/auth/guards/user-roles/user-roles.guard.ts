import { CanActivate, ExecutionContext, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators/role-protected/role-protected.decorator';

@Injectable()
export class UserRolesGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector,
  ){}

  
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const validRoles: String[] = this.reflector.get(META_ROLES, context.getHandler())

    if(!validRoles || validRoles.length === 0) return true;



    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if(!user) throw new InternalServerErrorException('User not found');

    for(const role of user.roles){
      if(validRoles.includes(role)){
        return true
      }
    }
    throw new ForbiddenException(`User ${user.name} need a valid role: [${validRoles}]`)
  }
}
