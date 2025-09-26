import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private client: RedisClientType | null = null;
  private isConnected = false;

  constructor() {
    this.initializeClient();
  }

  private async initializeClient() {
    try {
      const redisUrl = process.env.REDIS_URL;
      
      // If no Redis URL is provided, disable Redis functionality
      if (!redisUrl) {
        console.log('🟡 Redis URL not provided - session management disabled (JWT auth will still work)');
        return;
      }
      
      // Validate Redis URL format
      if (!redisUrl.startsWith('redis://') && !redisUrl.startsWith('rediss://')) {
        console.warn('Invalid Redis URL format. Redis functionality will be disabled.');
        return;
      }

      this.client = createClient({
        url: redisUrl,
        socket: {
          connectTimeout: 5000,
        },
      });

      this.client.on('error', (err) => {
        console.warn('Redis Client Error:', err.message);
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        console.log('✅ Connected to Redis');
        this.isConnected = true;
      });

      this.client.on('disconnect', () => {
        console.warn('Redis disconnected');
        this.isConnected = false;
      });

      await this.connect();
    } catch (error) {
      console.warn('Failed to initialize Redis client:', error.message);
      this.client = null;
    }
  }

  private async connect() {
    if (!this.client) return;
    
    try {
      await this.client.connect();
    } catch (error) {
      console.warn('Redis connection failed - session management will be disabled');
      this.client = null;
    }
  }

  async onModuleDestroy() {
    if (this.client && this.isConnected) {
      try {
        await this.client.quit();
      } catch (error) {
        console.warn('Error disconnecting from Redis:', error.message);
      }
    }
  }

  private isRedisAvailable(): boolean {
    return this.client !== null && this.isConnected;
  }

  async set(key: string, value: string, expireInSeconds?: number): Promise<void> {
    if (!this.isRedisAvailable()) {
      console.warn('Redis not available, skipping set operation');
      return;
    }

    try {
      if (expireInSeconds) {
        await this.client!.setEx(key, expireInSeconds, value);
      } else {
        await this.client!.set(key, value);
      }
    } catch (error) {
      console.warn('Redis set operation failed:', error.message);
    }
  }

  async get(key: string): Promise<string | null> {
    if (!this.isRedisAvailable()) {
      console.warn('Redis not available, returning null for get operation');
      return null;
    }

    try {
      return await this.client!.get(key);
    } catch (error) {
      console.warn('Redis get operation failed:', error.message);
      return null;
    }
  }

  async del(key: string): Promise<number> {
    if (!this.isRedisAvailable()) {
      console.warn('Redis not available, returning 0 for del operation');
      return 0;
    }

    try {
      return await this.client!.del(key);
    } catch (error) {
      console.warn('Redis del operation failed:', error.message);
      return 0;
    }
  }

  async exists(key: string): Promise<number> {
    if (!this.isRedisAvailable()) {
      console.warn('Redis not available, returning 0 for exists operation');
      return 0;
    }

    try {
      return await this.client!.exists(key);
    } catch (error) {
      console.warn('Redis exists operation failed:', error.message);
      return 0;
    }
  }

  async setHash(key: string, field: string, value: string): Promise<void> {
    if (!this.isRedisAvailable()) {
      console.warn('Redis not available, skipping setHash operation');
      return;
    }

    try {
      await this.client!.hSet(key, field, value);
    } catch (error) {
      console.warn('Redis setHash operation failed:', error.message);
    }
  }

  async getHash(key: string, field: string): Promise<string | undefined> {
    if (!this.isRedisAvailable()) {
      console.warn('Redis not available, returning undefined for getHash operation');
      return undefined;
    }

    try {
      const result = await this.client!.hGet(key, field);
      return result || undefined;
    } catch (error) {
      console.warn('Redis getHash operation failed:', error.message);
      return undefined;
    }
  }

  async getAllHash(key: string): Promise<Record<string, string>> {
    if (!this.isRedisAvailable()) {
      console.warn('Redis not available, returning empty object for getAllHash operation');
      return {};
    }

    try {
      return await this.client!.hGetAll(key);
    } catch (error) {
      console.warn('Redis getAllHash operation failed:', error.message);
      return {};
    }
  }

  async expire(key: string, seconds: number): Promise<boolean> {
    if (!this.isRedisAvailable()) {
      console.warn('Redis not available, returning false for expire operation');
      return false;
    }

    try {
      const result = await this.client!.expire(key, seconds);
      return result === 1;
    } catch (error) {
      console.warn('Redis expire operation failed:', error.message);
      return false;
    }
  }
}
