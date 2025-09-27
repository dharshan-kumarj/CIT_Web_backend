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

  async getUserProfile(userId: number) {
    console.log('getUserProfile called with userId:', userId);
    
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        userType: true,
        firstName: true,
        lastName: true,
        companyName: true,
        phone: true,
        isVerified: true,
        isActive: true,
        createdAt: true,
        lastLogin: true,
        vendor: {
          select: {
            id: true,
            companyDescription: true,
            businessLicense: true,
            taxId: true,
            address: true,
            website: true,
            verificationStatus: true,
          }
        },
        distributor: {
          select: {
            id: true,
            experienceYears: true,
            coverageAreas: true,
            distributionChannels: true,
            portfolioSize: true,
            verificationStatus: true,
            onboardingStatus: true,
          }
        }
      },
    });

    return user;
  }

  async getVendorDashboard(userId: number) {
    const user = await this.getUserProfile(userId);
    
    // Get vendor-specific data
    const partnerships = await this.prisma.partnership.findMany({
      where: { vendorId: userId },
      include: {
        distributor: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                companyName: true,
                email: true,
              }
            }
          }
        },
        productRequest: {
          select: {
            id: true,
            title: true,
            productDescription: true,
            status: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const productRequests = await this.prisma.productRequest.findMany({
      where: { vendorId: userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    const notifications = await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    const stats = await this.getVendorStats(userId);

    return {
      message: 'Welcome to Vendor Dashboard',
      user,
      partnerships,
      productRequests,
      notifications,
      stats,
      timestamp: new Date().toISOString(),
    };
  }

  async getDistributorDashboard(userId: number) {
    const user = await this.getUserProfile(userId);
    
    // Get distributor-specific data
    const partnerships = await this.prisma.partnership.findMany({
      where: { distributorId: userId },
      include: {
        vendor: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                companyName: true,
                email: true,
              }
            }
          }
        },
        productRequest: {
          select: {
            id: true,
            title: true,
            productDescription: true,
            status: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const availableRequests = await this.prisma.productRequest.findMany({
      where: {
        status: 'open',
        partnerships: {
          none: {
            distributorId: userId,
          }
        }
      },
      include: {
        vendor: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                companyName: true,
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const notifications = await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    const trainingProgress = await this.prisma.trainingProgress.findMany({
      where: { distributorId: userId },
      include: {
        trainingModule: {
          select: {
            id: true,
            title: true,
            description: true,
            estimatedDuration: true,
          }
        }
      },
    });

    const stats = await this.getDistributorStats(userId);

    return {
      message: 'Welcome to Distributor Dashboard',
      user,
      partnerships,
      availableRequests,
      notifications,
      trainingProgress,
      stats,
      timestamp: new Date().toISOString(),
    };
  }

  private async getVendorStats(userId: number) {
    const totalPartnerships = await this.prisma.partnership.count({
      where: { vendorId: userId },
    });

    const activePartnerships = await this.prisma.partnership.count({
      where: { 
        vendorId: userId,
        status: 'active',
      },
    });

    const totalRequests = await this.prisma.productRequest.count({
      where: { vendorId: userId },
    });

    const openRequests = await this.prisma.productRequest.count({
      where: { 
        vendorId: userId,
        status: 'open',
      },
    });

    return {
      totalPartnerships,
      activePartnerships,
      totalRequests,
      openRequests,
    };
  }

  private async getDistributorStats(userId: number) {
    const totalPartnerships = await this.prisma.partnership.count({
      where: { distributorId: userId },
    });

    const activePartnerships = await this.prisma.partnership.count({
      where: { 
        distributorId: userId,
        status: 'active',
      },
    });

    const completedTraining = await this.prisma.trainingProgress.count({
      where: { 
        distributorId: userId,
        status: 'completed',
      },
    });

    const totalTraining = await this.prisma.trainingProgress.count({
      where: { distributorId: userId },
    });

    return {
      totalPartnerships,
      activePartnerships,
      trainingCompletion: totalTraining > 0 ? Math.round((completedTraining / totalTraining) * 100) : 0,
      completedModules: completedTraining,
      totalModules: totalTraining,
    };
  }

  async getUserPartnerships(userId: number, userType: string) {
    const whereClause = userType === 'vendor' 
      ? { vendorId: userId }
      : { distributorId: userId };

    return this.prisma.partnership.findMany({
      where: whereClause,
      include: {
        vendor: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                companyName: true,
                email: true,
              }
            }
          }
        },
        distributor: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                companyName: true,
                email: true,
              }
            }
          }
        },
        productRequest: {
          select: {
            id: true,
            title: true,
            productDescription: true,
            status: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUserNotifications(userId: number) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }

  async getVendorProductRequests(userId: number) {
    return this.prisma.productRequest.findMany({
      where: { vendorId: userId },
      include: {
        partnerships: {
          include: {
            distributor: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                    companyName: true,
                  }
                }
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAvailableOpportunities(userId: number) {
    return this.prisma.productRequest.findMany({
      where: {
        status: 'open',
        partnerships: {
          none: {
            distributorId: userId,
          }
        }
      },
      include: {
        vendor: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                companyName: true,
              }
            }
          }
        },
        partnerships: {
          select: {
            id: true,
            status: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
