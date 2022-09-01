import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class LoadAddressDto {
  @IsOptional()
  @IsBoolean()
  isDefault: boolean;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsOptional()
  @IsUUID()
  cityId?: string;

  @IsOptional()
  @IsUUID()
  stateId?: string;

  @IsOptional()
  @IsUUID()
  zipcodeId?: string;

  @IsOptional()
  @IsBoolean()
  isInternational?: boolean;

  @IsNotEmpty()
  @IsString()
  country: string;
}
