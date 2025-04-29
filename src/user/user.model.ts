// model file is used to define the structure of the table
import {
  Table,
  Column,
  DataType,
  Model,
  PrimaryKey,
  AutoIncrement,
  Unique,
  HasMany,
} from 'sequelize-typescript'; //decorators used to describe the table and its content
import { Order } from './order.model'; //this imports a order model to define a relationship that a user can have many orders
import { Role } from '../common/enums/role.enum'; //this imports a custom Role

@Table //@Table indicates that this class maps to a table called Users
export class User extends Model<User> {
  //User extends Model<User> make it a user model with sequelize attribute
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  address: string;

  @Unique
  @Column({ type: DataType.STRING, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Column({
    type: DataType.ENUM(...Object.values(Role)),
    //DataType.ENUM- use to define enum datatype in the table, which is a list of predefined value and the column will accept only one value from the list
    //... - spread operator in JS used to expand an iterable(like array, string, or object) into individual elements.
    //Object.values-takes an object and return an array of its values(not key).
    allowNull: false, //this tells sequelize do not do not allow null values in the column and u cant even set it null explicitly
    defaultValue: Role.USER,
  })
  role: Role;
  //role: name of the column in sequelize model
  //Role: this sets the type of 'role' property using a typescript enum called Role.
  //this property(column) must have a value that matches one of the values from the Role enum.
  @HasMany(() => Order) //@HasMany- sequelize decorator to define one to many relationship between user and order
  //if you directly pass the Order than it might be a case that Order model is not loaded in the memory
  //but by using an arrow function, passing a function that sequelize can call later when all the models are loaded in the memory.
  orders: Order[]; //this orders property is an array of Order objects- one user can have mulitple orders.
}
