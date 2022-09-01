import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PaymentTermDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  dueDate: number;

  @IsNotEmpty()
  @IsString()
  type: string;
}
