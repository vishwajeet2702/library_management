import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { User } from './user/user.model';
import { Book } from './admin/book.model';
import { Order } from './user/order.model';

@Module({
  imports: [
    //loads environment variable globally
    ConfigModule.forRoot({ isGlobal: true }),

    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadModels: true,
      synchronize: true, //synchronize model with database
      models: [User, Book, Order],
    }),
    AuthModule,
    UserModule,
    AdminModule,
  ],
})
export class AppModule {}
