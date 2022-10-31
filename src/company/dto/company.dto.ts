import { AddressDto } from '../../common/dto/address.dto';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

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
  @Type(() => AddressDto)
  companyAddress: AddressDto;
}
