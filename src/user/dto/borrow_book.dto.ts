import { IsInt, IsPositive } from 'class-validator';
// dto used when the user want to borrows book
export class BorrowBookDto {
  //id of the book to borrow
  @IsInt({ message: 'Book ID must be an integer' })
  bookId: number;

  //Quantity must be a positive
  @IsInt({ message: 'Qunatity must be an Integer' })
  @IsPositive({ message: 'Quantity must be greater than zero' })
  quantity: number;
}
