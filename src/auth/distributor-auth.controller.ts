import { 
  Controller, 
  Post, 
  Body, 
  HttpCode, 
  HttpStatus,
  ValidationPipe,
  Delete,
  Param 
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, LoginResponseDto, LogoutDto, RegisterDto, RegisterResponseDto } from './auth.dto';
import { UserType } from '@prisma/client';

@Controller('auth/distributor')
export class DistributorAuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body(ValidationPipe) loginDto: LoginDto,
  ): Promise<LoginResponseDto> {
    return this.authService.login(loginDto, UserType.distributor);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body(ValidationPipe) registerDto: RegisterDto,
  ): Promise<RegisterResponseDto> {
    return this.authService.register(registerDto, UserType.distributor);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body(ValidationPipe) logoutDto: LogoutDto): Promise<{ message: string }> {
    return this.authService.logout(logoutDto.sessionId);
  }

  @Post('refresh/:sessionId')
  @HttpCode(HttpStatus.OK)
  async refreshSession(@Param('sessionId') sessionId: string): Promise<{ message: string }> {
    await this.authService.refreshSession(sessionId);
    return { message: 'Session refreshed successfully' };
  }
}
