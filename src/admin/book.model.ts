import {
  Table,
  Column,
  DataType,
  Model,
  PrimaryKey,
  AutoIncrement,
  HasMany,
} from 'sequelize-typescript';
import { Order } from '../user/order.model';

@Table
export class Book extends Model<Book> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  author: string;

  @Column({ type: DataType.STRING })
  description: string;

  @Column({ type: DataType.STRING, allowNull: false })
  quantity: number;

  //a book can be a part of many orders
  @HasMany(() => Order)
  orders: Order[];
}
