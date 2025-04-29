import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt.payload';
import { RedisService } from '../redis/redis.service';
import { Request } from 'express';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly redisService: RedisService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      //extracts the token from the Authorization: Bearer <token> header
      ignoreExpiration: false,
      //ignore the token if it is expired
      secretOrKey: process.env.JWT_SECRET || 'supersecretkey',
      //The secret key used to verify the JWT signature
      passReqToCallback: true,
    });
  }
  async validate(req: Request, payload: JwtPayload) {
    //this method is automatically called after the token is decoded and verified
    //payload is the object inside your JWT like { userId, email, role }

    const client = this.redisService.getClient();
    //get the redis client
    const redisKey = `auth:user:${payload.userId}:tokens`;
    //creates a key based on userId in the payload
    // const storedToken = await client.get(redisKey);
    //fetch the stored jwt token in the redis using that key
    const currentToken = req.headers.authorization
      ?.replace('Bearer ', '')
      .trim();
    const isMemeber = await client.sismember(redisKey, currentToken);
    //extracting the token in the authorization header and removes bearer
    if (!isMemeber) {
      throw new UnauthorizedException(
        'Token has been invalidated or is missing',
      );
    }

    return { userId: payload.userId, email: payload.email, role: payload.role };
    //this method returns the user info that gets attached to req.user
  }
}
