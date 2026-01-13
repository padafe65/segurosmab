import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

/**
 * Guard opcional de JWT que no lanza error si no hay token
 * Útil para endpoints públicos que pueden funcionar con o sin autenticación
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // Intentar autenticar, pero no fallar si no hay token
    const result = super.canActivate(context);
    
    if (result instanceof Promise) {
      return result.catch(() => {
        // Si falla la autenticación (no hay token), permitir continuar
        return true;
      });
    }
    
    return result;
  }

  handleRequest(err: any, user: any, info: any) {
    // Si hay error o no hay usuario, retornar undefined en lugar de lanzar error
    if (err || !user) {
      return undefined;
    }
    return user;
  }
}
