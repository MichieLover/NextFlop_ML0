import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    try {
      const user = await this.authService.register(dto);
      return { success: true, user };
    } catch (err) {
      throw new HttpException(err.message || 'Registration failed', HttpStatus.BAD_REQUEST);
    }
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const token = await this.authService.login(dto);
    if (!token) throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    return { accessToken: token };
  }
}
