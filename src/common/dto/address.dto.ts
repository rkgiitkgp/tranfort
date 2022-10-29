import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class AddressDto {
  @IsOptional()
  @IsUUID()
  entityId?: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsOptional()
  @IsUUID()
  zipcodeId?: string;
}
