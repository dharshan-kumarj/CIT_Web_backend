import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard, VendorGuard, DistributorGuard } from './auth/auth.guards';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('users')
  @UseGuards(JwtAuthGuard)
  async getUsers(@Request() req) {
    return this.appService.getUsers();
  }

  @Get('vendor/dashboard')
  @UseGuards(JwtAuthGuard, VendorGuard)
  getVendorDashboard(@Request() req) {
    return {
      message: 'Welcome to Vendor Dashboard',
      user: req.user,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('distributor/dashboard')
  @UseGuards(JwtAuthGuard, DistributorGuard)
  getDistributorDashboard(@Request() req) {
    return {
      message: 'Welcome to Distributor Dashboard',
      user: req.user,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return {
      message: 'User Profile',
      user: req.user,
    };
  }
}
