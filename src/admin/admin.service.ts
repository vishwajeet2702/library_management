import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize'; //used to work with sequelize ORM, this decorator helps to inject the sequelize model into the service 
import { Book } from './book.model'; //sequelize model representing the Book table in the database
import { CreateBookDto } from './dto/create_book.dto'; //defines the structure of the data use to create or update a book

@Injectable() //this decorator tells NestJs that this class can be injected into other parts of the app, such as controller
export class AdminService {
  constructor(
    @InjectModel(Book)
    private bookModel: typeof Book, //the bookModel is injected into the service, allowing us to intercat with the book model(book table)
  ) {}
  //Add a new Book
  async addOrUpdateBook(createBookDto: CreateBookDto): Promise<Book> {
    //createBookDto: CreateBookDto - input parameters.
    //Promise<Book> - this function returns a promise that resolves to a Book object
    const { name, author, description, quantity } = createBookDto;

    const existingBook = await this.bookModel.findOne({
      //this is an instance of book model injected using Sequelize
      //bookModel is a sequelize model class that provides methods like findOne, findAll, create, etc.
      where: { name, author },
      //checks if the book with same name and author is already exist in the database
    });
    if (existingBook) {
      existingBook.quantity = Number(existingBook.quantity) + quantity;
      await existingBook.save(); // sequelize method used to update an instance
      return existingBook;
    }

    const newBook = await this.bookModel.create({
      name,
      author,
      description,
      quantity,
    });
    return newBook;
  }
  //get all the books
  async getAllBooks(): Promise<Book[]> {
    return this.bookModel.findAll();
  }
}
