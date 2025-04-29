import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { User } from './user.model';
import { Role } from '../common/enums/role.enum';
@Injectable()
export class UserSeederService implements OnModuleInit {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}
  async onModuleInit() {
    const userCount = await this.userModel.count();
    if (userCount === 0) {
      const hashedPassword = await bcrypt.hash(
        process.env.ADMIN_DEFAULT_PASSWORD,
        10,
      );
      await this.userModel.create({
        name: 'ADMIN',
        address: 'Default Address',
        email: 'admin@lib.com',
        password: hashedPassword,
        role: Role.ADMIN,
      });
      console.log(' Default user is created ');
    }
  }
}
