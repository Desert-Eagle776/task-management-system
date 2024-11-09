import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from './roles.decorator';
import { AuthService } from 'src/auth/auth.service';
import { FamilyRoles } from 'src/common';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private authService: AuthService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requireRoles = this.reflector.getAllAndOverride<FamilyRoles[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requireRoles) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.headers?.authorization?.split(' ');
    const decodedToken = this.authService.getUserDataFromToken(token[1]);

    if (!decodedToken) {
      return false;
    }

    return this.validateRoles(requireRoles, decodedToken.roles);
  }

  validateRoles(roles: string[], userRoles: string[]) {
    return roles.some((role) => userRoles.includes(role));
  }
}
