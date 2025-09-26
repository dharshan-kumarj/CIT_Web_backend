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
import { LoginDto, LoginResponseDto, LogoutDto } from './auth.dto';
import { UserType } from '@prisma/client';

@Controller('auth/vendor')
export class VendorAuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body(ValidationPipe) loginDto: LoginDto,
  ): Promise<LoginResponseDto> {
    return this.authService.login(loginDto, UserType.vendor);
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
