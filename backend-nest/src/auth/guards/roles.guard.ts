import { Injectable, ForbiddenException } from '@nestjs/common'
import { CanActivate, ExecutionContext }   from '@nestjs/common'
import { Reflector }                       from '@nestjs/core'
import { ROLES_KEY }                       from '../decorators/roles.decorator'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Ambil roles yang dibutuhkan dari decorator @Roles(...)
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    // Kalau tidak ada @Roles, berarti semua boleh akses
    if (!requiredRoles) return true

    const { user } = context.switchToHttp().getRequest()

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(`Role '${user.role}' tidak punya akses`)
    }

    return true
  }
}