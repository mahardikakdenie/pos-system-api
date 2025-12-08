// src/common/guards/role.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // Jika tidak ada metadata 'roles', izinkan (opsional)
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.profile;
    console.log("requiredRoles : ", requiredRoles);
    

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.role || !user.role.name) {
      throw new UnauthorizedException('User role not defined');
    }

    const hasRole = requiredRoles.some((role) => role === user.role.name);
    if (!hasRole) {
      throw new UnauthorizedException('Insufficient permissions');
    }

    return true;
  }
}
