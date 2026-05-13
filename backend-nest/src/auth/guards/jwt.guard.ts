import { Injectable, UnauthorizedException } from '@nestjs/common'
import { CanActivate, ExecutionContext }      from '@nestjs/common'
import * as jwt from 'jsonwebtoken'

@Injectable()
export class JwtGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const authHeader = request.headers.authorization

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token tidak ditemukan')
    }

    const token = authHeader.split(' ')[1]

    try {
      // Perbaikan: Tambahkan 'as string' agar tidak error TS2769
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
      
      request.user = decoded  // simpan user ke request
      return true
    } catch {
      throw new UnauthorizedException('Token tidak valid atau kadaluarsa')
    }
  }
}