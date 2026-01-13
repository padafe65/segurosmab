import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorador opcional para obtener el usuario del request
 * No lanza error si no hay usuario (útil para endpoints públicos con autenticación opcional)
 */
export const GetUserOptional = createParamDecorator(
  (data, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Si no hay usuario, retorna undefined en lugar de lanzar error
    if (!user) return undefined;

    return (!data) ? user : user[data];
  }
);
