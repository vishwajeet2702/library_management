//custom auth guard that tells nestjs to use jwt strategy when protecting routes

import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
