import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Book } from '../admin/book.model';

@Table //it maps to a table named orders by default
export class Order extends Model<Order> {
  //Order class extends sequelize Model class that provides methods like .create(), .findAll()
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => User)
  //creates a foreign key reference to the user model
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number;

  @BelongsTo(() => User) //@BelongsTo: Sets up the relationship from Order to User
  user: User;

  @ForeignKey(() => Book)
  @Column({ type: DataType.INTEGER, allowNull: false })
  bookId: number;

  @BelongsTo(() => Book)
  book: Book;

  @Column({ type: DataType.INTEGER, allowNull: false })
  quantity: number;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  issuedAt: Date;
}
