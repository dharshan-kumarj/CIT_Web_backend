import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { RedisService } from '../redis.service';
import * as bcrypt from 'bcrypt';
import { LoginDto, LoginResponseDto, RegisterDto, RegisterResponseDto } from './auth.dto';
import { UserType } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private redisService: RedisService,
  ) {}

  async validateUser(email: string, password: string, userType: UserType) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
        userType,
        isActive: true,
      },
      include: {
        vendor: userType === 'vendor',
        distributor: userType === 'distributor',
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(loginDto: LoginDto, userType: UserType): Promise<LoginResponseDto> {
    const user = await this.validateUser(loginDto.email, loginDto.password, userType);

    const payload = {
      sub: user.id,
      email: user.email,
      userType: user.userType,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const token = this.jwtService.sign(payload);
    const sessionId = uuidv4();

    // Store session in Redis with expiration
    const sessionData = {
      userId: user.id.toString(),
      email: user.email,
      userType: user.userType,
      token,
      loginTime: new Date().toISOString(),
    };

    // Try to store session in Redis (optional - JWT auth will still work without it)
    try {
      const sessionExpiry = parseInt(process.env.SESSION_EXPIRE_SECONDS || '604800'); // 7 days default
      await this.redisService.set(
        `session:${sessionId}`,
        JSON.stringify(sessionData),
        sessionExpiry,
      );
    } catch (error) {
      console.warn('Failed to store session in Redis, but JWT authentication will still work:', error.message);
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Log activity
    await this.prisma.activityLog.create({
      data: {
        userId: user.id,
        action: 'LOGIN',
        entityType: 'USER',
        entityId: user.id,
        description: `${userType} login successful`,
        createdAt: new Date(),
      },
    });

    return {
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        userType: user.userType,
        firstName: user.firstName,
        lastName: user.lastName,
        companyName: user.companyName || undefined,
      },
      sessionId,
    };
  }

  async logout(sessionId: string): Promise<{ message: string }> {
    try {
      const sessionExists = await this.redisService.exists(`session:${sessionId}`);
      
      if (sessionExists) {
        await this.redisService.del(`session:${sessionId}`);
      }
    } catch (error) {
      console.warn('Failed to remove session from Redis, but logout completed:', error.message);
    }

    return { message: 'Logout successful' };
  }

  async validateSession(sessionId: string): Promise<any> {
    try {
      const sessionData = await this.redisService.get(`session:${sessionId}`);
      
      if (!sessionData) {
        throw new UnauthorizedException('Session expired or invalid');
      }

      return JSON.parse(sessionData);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      console.warn('Redis session validation failed, falling back to JWT-only auth:', error.message);
      throw new UnauthorizedException('Session validation failed - please re-authenticate');
    }
  }

  async refreshSession(sessionId: string): Promise<void> {
    try {
      const sessionExists = await this.redisService.exists(`session:${sessionId}`);
      
      if (sessionExists) {
        const sessionExpiry = parseInt(process.env.SESSION_EXPIRE_SECONDS || '604800');
        await this.redisService.expire(`session:${sessionId}`, sessionExpiry);
      }
    } catch (error) {
      console.warn('Failed to refresh session in Redis:', error.message);
      // Don't throw error - JWT auth will still work
    }
  }

  // Helper method to hash passwords (for user registration)
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  async register(registerDto: RegisterDto, userType: UserType): Promise<RegisterResponseDto> {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Hash password
    const passwordHash = await this.hashPassword(registerDto.password);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        passwordHash,
        userType,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        companyName: registerDto.companyName,
        phone: registerDto.phone,
        isVerified: false, // Users need to verify email
        isActive: true,
        createdAt: new Date(),
      },
    });

    // Create profile based on user type
    if (userType === UserType.vendor) {
      await this.prisma.vendor.create({
        data: {
          userId: user.id,
          companyDescription: '',
          verificationStatus: 'pending',
        },
      });
    } else if (userType === UserType.distributor) {
      await this.prisma.distributor.create({
        data: {
          userId: user.id,
          verificationStatus: 'pending',
          onboardingStatus: 'not_started',
        },
      });
    }

    // Log activity
    await this.prisma.activityLog.create({
      data: {
        userId: user.id,
        action: 'REGISTER',
        entityType: 'USER',
        entityId: user.id,
        description: `${userType} registration successful`,
        createdAt: new Date(),
      },
    });

    return {
      message: 'Registration successful',
      user: {
        id: user.id,
        email: user.email,
        userType: user.userType,
        firstName: user.firstName,
        lastName: user.lastName,
        companyName: user.companyName || undefined,
      },
    };
  }

  // Verify JWT token
  async verifyToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
