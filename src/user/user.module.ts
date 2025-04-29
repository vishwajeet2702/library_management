import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.model';
import { Book } from '../admin/book.model';
import { Order } from './order.model';
import { UserSeederService } from './user.seed';
@Module({
  imports: [SequelizeModule.forFeature([User, Book, Order])],
  controllers: [UserController],
  providers: [UserService, UserSeederService],
})
export class UserModule {}
