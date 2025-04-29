import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../user/user.model';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RedisService } from '../redis/redis.service';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async logout(userId: number, token: string): Promise<void> {
    const client = this.redisService.getClient();
    const redisKey = `auth:user:${userId}:tokens`;
    await client.srem(redisKey, token);
  }

  async login(loginDto: LoginDto): Promise<string | null> {
    const user = await this.userModel.findOne({
      where: { email: loginDto.email },
    });
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) return null;
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
    const token = this.jwtService.sign(payload);

    //Store the token in Redis
    const redisKey = `auth:user:${user.id}:tokens`;
    //creating a redis key using the users id
    //this key will act like a label under which the token will be stored
    const client = this.redisService.getClient();
    //gets the active redis connection(client) from the custom RedisService
    //way to interact with the redis using ioredis

    const tokenCount = await client.scard(redisKey);    
    if (tokenCount >= 5) {
      throw new UnauthorizedException('Cannot login on more than 5 devicess');
    }
    await client.sadd(redisKey, token);
    //store the jwt token in the redis under the key auth:user:{user.id}
    //it overwrites the existing token for that user
    return token;
  }
}
