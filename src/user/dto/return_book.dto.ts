import { IsInt, IsPositive } from 'class-validator';

export class ReturnBookDto {
  @IsInt({ message: 'Book Id must be an integer' })
  bookId: number;

  @IsInt({ message: 'quantity must be an integer' })
  @IsPositive({ message: 'Quantity must be greater than zero' })
  quantity: number;
}
