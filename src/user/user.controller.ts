import { Controller, UseGuards, Get, Post, Body, Req } from '@nestjs/common';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from '../auth/auth.guard';
import { UserService } from './user.service';
import { Role } from '../common/enums/role.enum';
import { Roles } from '../common/decorator/roles.decorator';
import { BorrowBookDto } from './dto/borrow_book.dto';
import { ReturnBookDto } from './dto/return_book.dto';
import { User } from './user.model';
import { Book } from '../admin/book.model';
import { Order } from './order.model';
import { CreateUserDto } from './dto/create.user.dto';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }
  @UseGuards(JwtAuthGuard, RolesGuard) //JwtAuthGuard - protects route from the unauthenticated user, validate the jwt token sent in the request
  //RolesGuard - checks if the authenticated user has the correct role to access the route
  @Roles(Role.USER)
  @Get('books')
  async getAvailableBooks(): Promise<Book[]> {
    return this.userService.getAvailableBooks();
  }

  //api for requesting the book from the library
  //EXPLAINATION - suppose a user with id 1 has made a request JwtAuthGuard will validate req.user = {
  //   userId: 1,
  //   email: 'user1@example.com',
  //   role: 'USER'
  // }
  @UseGuards(JwtAuthGuard, RolesGuard) //JwtAuthGuard - protects route from the unauthenticated user, validate the jwt token sent in the request
  //RolesGuard - checks if the authenticated user has the correct role to access the route
  @Roles(Role.USER)
  @Post('orders')
  async borrowBook(
    @Body() borrowDto: BorrowBookDto, //this parses the json data in the payload and maps it with the DTO
    @Req() req,
  ): Promise<Order> {
    const userId = req.user.userId;
    return this.userService.borrowBook(userId, borrowDto);
  }
  //Suppose a user with id=10 made a request to borrow book(id=5 quantity=1)
  //so borrorDto = { bookId: 5, quantity: 1}
  //req.user = { userid: 10, email: "user@example.com", role: "ADMIN" }
  @UseGuards(JwtAuthGuard, RolesGuard) //JwtAuthGuard - protects route from the unauthenticated user, validate the jwt token sent in the request
  //RolesGuard - checks if the authenticated user has the correct role to access the route
  @Roles(Role.USER)
  @Post('orders/return')
  async returnBook(
    @Body() returnDto: ReturnBookDto,
    @Req() req,
  ): Promise<string> {
    const userId = req.user.userId;
    return this.userService.returnBook(userId, returnDto);
  }
  @UseGuards(JwtAuthGuard, RolesGuard) //JwtAuthGuard - protects route from the unauthenticated user, validate the jwt token sent in the request
  //RolesGuard - checks if the authenticated user has the correct role to access the route
  @Roles(Role.USER)
  @Get('orders')
  async getMyOrder(@Req() req): Promise<Order[]> {
    const userId = req.user.userId;
    return this.userService.getMyOrder(userId);
  }
}
