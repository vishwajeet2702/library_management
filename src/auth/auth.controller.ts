import {
  Controller,
  Post,
  UnauthorizedException,
  Body,
  UseGuards,
  Delete,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from './requestUserInterface';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  //private - such that it can be only used inside AuthController class
  //readinly - this ensures immutablility means you can assign value only once - when the property is first created, it can not be changed.
  //changeName() {
  //     this.name = 'New Name'; // Error: Cannot assign to 'name' because it is a read-only property.
  //   }
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    //@Body() extracts the data from the http request
    const token = await this.authService.login(loginDto);
    if (!token) throw new UnauthorizedException('Invalid credentials');

    return { accessToken: token };
  }
  @Delete('logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(@Req() req: RequestWithUser) {
    const user = req.user as { userId: number };
    const token = req.headers.authorization?.replace('Bearer ', '').trim();
    if (!token) {
      throw new UnauthorizedException('Token missing');
    }
    await this.authService.logout(user.userId, token);
    return { message: 'Logout successfully' };
  }
}
