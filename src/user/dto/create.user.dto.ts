//DTO(Data Transfer Object) are used to validate input data before it's passed to the service layer
import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { Role } from '../../common/enums/role.enum';
export class CreateUserDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsNotEmpty({ message: 'Address is required' })
  address: string;

  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @MinLength(6, { message: 'Password must be atleast 6 characters' })
  password: string;

  @IsEnum(Role, { message: 'Invalid Role' })
  role: Role;
}
