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
  async getVendorDashboard(@Request() req) {
    console.log('Vendor dashboard request - user:', req.user);
    const userId = req.user.sub || req.user.userId;
    return this.appService.getVendorDashboard(userId);
  }

  @Get('distributor/dashboard')
  @UseGuards(JwtAuthGuard, DistributorGuard)
  async getDistributorDashboard(@Request() req) {
    console.log('Distributor dashboard request - user:', req.user);
    const userId = req.user.sub || req.user.userId;
    return this.appService.getDistributorDashboard(userId);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    console.log('Profile request - user:', req.user);
    const userId = req.user.sub || req.user.userId;
    const profile = await this.appService.getUserProfile(userId);
    return {
      ...profile,
      // Map to frontend expected format
      role: profile?.userType,
      name: profile ? `${profile.firstName} ${profile.lastName}`.trim() : '',
    };
  }

  @Get('partnerships')
  @UseGuards(JwtAuthGuard)
  async getPartnerships(@Request() req) {
    return this.appService.getUserPartnerships(req.user.sub, req.user.userType);
  }

  @Get('notifications')
  @UseGuards(JwtAuthGuard)
  async getNotifications(@Request() req) {
    return this.appService.getUserNotifications(req.user.sub);
  }

  @Get('product-requests')
  @UseGuards(JwtAuthGuard, VendorGuard)
  async getProductRequests(@Request() req) {
    return this.appService.getVendorProductRequests(req.user.sub);
  }

  @Get('available-opportunities')
  @UseGuards(JwtAuthGuard, DistributorGuard)
  async getAvailableOpportunities(@Request() req) {
    return this.appService.getAvailableOpportunities(req.user.sub);
  }
}
