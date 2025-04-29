import { Role } from '../common/enums/role.enum';

export interface JwtPayload {
  userId: number;
  email: string;
  role: Role;
}
//this defines an interface called JwtPayload - it describes the shape of data stored in a JWT token.

//JwtPayload is just a plain object so I am using interface to define the structure of the object.
