import { IsNotEmpty, IsString, Min, IsInt } from 'class-validator';

export class CreateBookDto {
  //This is usually a class used to define and validate incoming request data.
  @IsString()
  @IsNotEmpty({ message: 'Book name is required' })
  name: string;
  @IsString()
  @IsNotEmpty({ message: 'Author name is required' })
  author: string;

  @IsString()
  @IsNotEmpty({ message: 'description is required' })
  description: string;

  @IsInt({ message: 'Quantity must be an integer' })
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity: number;
}
