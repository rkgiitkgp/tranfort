import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class BookingDto {
  @IsNotEmpty()
  @IsUUID()
  loadId: string;

  @IsOptional()
  comments?: string;
}
