import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Book } from './book.model';
import { User } from '../user/user.model';

@Module({
  imports: [SequelizeModule.forFeature([Book, User])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
