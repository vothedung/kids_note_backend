import { Injectable } from '@nestjs/common';
import { HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisHealthIndicator {
  constructor(private readonly configService: ConfigService) {}

  async pingCheck(key: string): Promise<HealthIndicatorResult> {
    const url = this.configService.get<string>('redis.url');
    const client = new Redis(url as string, { lazyConnect: true, connectTimeout: 3000 });
    try {
      await client.connect();
      const pong = await client.ping();
      return { [key]: { status: pong === 'PONG' ? 'up' : 'down' } };
    } catch (error) {
      throw new HealthCheckError('Redis check failed', {
        [key]: { status: 'down', message: (error as Error).message },
      });
    } finally {
      client.disconnect();
    }
  }
}
