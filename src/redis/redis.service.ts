import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit {
  private client: Redis;
  onModuleInit() {
    //creating a new redis connection using ioredis
    this.client = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
    });
  }
  getClient() {
    //getter method to access the redis client from outside this class
    return this.client;
  }
}
