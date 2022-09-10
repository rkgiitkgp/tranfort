import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class CompanyAddressDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsOptional()
  @IsUUID()
  zipcodeId?: string;
}

export class CompanyDto {
  @IsNotEmpty()
  @IsString()
  adharNumber: string;

  @IsNotEmpty()
  @IsString()
  cinNumber: string;

  @IsNotEmpty()
  @IsString()
  panNumber: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CompanyAddressDto)
  companyAddress: CompanyAddressDto;
}
