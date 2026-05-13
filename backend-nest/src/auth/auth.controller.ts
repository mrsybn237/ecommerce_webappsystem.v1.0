import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common'
import { AuthService } from './auth.service'
import { JwtGuard }    from './guards/jwt.guard'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: any) {
    return this.authService.register(body)
  }

  @Post('login')
  login(@Body() body: { email: string, password: string }) {
    return this.authService.login(body)
  }

  @Get('me')
  @UseGuards(JwtGuard)
  getMe(@Request() req: any) {
    return this.authService.getMe(req.user.id)
  }
}