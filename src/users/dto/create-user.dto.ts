import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserType } from '../constant';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too weak',
  })
  password: string;

  @IsNotEmpty()
  @IsEnum(UserType)
  type: UserType;
}
