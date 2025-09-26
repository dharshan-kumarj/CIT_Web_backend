import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  getHello(): string {
    return 'Hello World! CIT Backend API is running.';
  }

  async getUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        userType: true,
        firstName: true,
        lastName: true,
        companyName: true,
        isVerified: true,
        isActive: true,
        createdAt: true,
      },
    });
  }
}
