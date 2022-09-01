import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class ZipcodeDto {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsUUID()
  cityId: string;
}
