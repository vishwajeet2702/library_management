import { Controller, UseGuards, Post, Get, Body } from '@nestjs/common'; //UseGuard is used to apply authentication
import { JwtAuthGuard } from '../auth/auth.guard'; //Guard to check if a request has a valid Jwt token
import { RolesGuard } from '../common/guards/roles.guard'; //Guard to check if the user has required role
import { Role } from '../common/enums/role.enum';
import { Roles } from '../common/decorator/roles.decorator';
import { AdminService } from './admin.service';
import { CreateBookDto } from './dto/create_book.dto';
import { Book } from './book.model';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard) //Applies JwtAuthGuard and RolesGuard globally to all methods in this controller.
@Roles(Role.ADMIN) //Only ADMIN can access
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  //injecting the AdminService class via constructor such that controller can use its methods

  @Post('books')
  async addOrUpdateBook(@Body() createBookDto: CreateBookDto): Promise<Book> {
    //@Body() is a parameter decorator used inside a controller method to extract the data sent in the body of the http request
    //@Body() createBookDto: CreateBookDto - will create the CreateBookDto's instance
    return this.adminService.addOrUpdateBook(createBookDto);
  }

  @Get('books')
  async getAllBooks(): Promise<Book[]> {
    return this.adminService.getAllBooks();
  }
}
