import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from '../common/enums/role.enum';
import { User } from './user.model';
import { Book } from '../admin/book.model';
import { Order } from './order.model';
import { BorrowBookDto } from './dto/borrow_book.dto';
import { ReturnBookDto } from './dto/return_book.dto';
import { CreateUserDto } from './dto/create.user.dto';
import { sendLowStockAlert } from '../grpc/notification.client';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectModel(Book) private readonly bookModel: typeof Book,
    @InjectModel(Order) private readonly orderModel: typeof Order,
  ) {}
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const userRole = createUserDto.role || Role.USER;
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
      role: userRole,
    });
    return user;
  }

  async getAvailableBooks(): Promise<Book[]> {
    return this.bookModel.findAll();
  }

  async borrowBook(userId: number, borrowDto: BorrowBookDto): Promise<Order> {
    const { bookId, quantity } = borrowDto;
    const book = await this.bookModel.findByPk(bookId);
    if (!book) throw new NotFoundException('Book not found');

    if (book.quantity < quantity) {
      throw new BadRequestException('Not enough books available');
    }
    book.quantity -= quantity;
    await book.save();

    if (book.quantity === 0) {
      sendLowStockAlert(bookId, book.name);
    }

    const order = await this.orderModel.create({
      userId,
      bookId,
      quantity,
    });
    return order;
  }

  async returnBook(userId: number, returnDto: ReturnBookDto): Promise<string> {
    const { bookId, quantity } = returnDto;
    const order = await this.orderModel.findOne({
      where: { userId, bookId },
    });
    if (!order) throw new NotFoundException('Order not found');

    if (order.quantity < quantity) {
      throw new BadRequestException('You are returning more than borrowed');
    }
    const book = await this.bookModel.findByPk(bookId);
    if (!book) throw new NotFoundException('Order not found');

    book.quantity = Number(book.quantity) + quantity;
    await book.save();

    if (order.quantity === quantity) {
      await order.destroy();
    } else {
      order.quantity -= quantity;
      await order.save();
    }
    return ' Book returned successfully ';
  }

  async getMyOrder(userId: number): Promise<Order[]> {
    return this.orderModel.findAll({
      where: { userId }, //it filters the order table for rows where the userId column matches the provided userId
      include: [Book], //it will tell sequelize to also include the associated book data for each order
      //so each returned Order will contain the full Book object inside it.
    });
  }
}
