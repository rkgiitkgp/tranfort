import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { AdditionalMeasureUOM, WeightUnit } from '../constant';
import { LoadAddressDto } from './load-address.dto';

export class LoadDto {
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LineItemDto)
  lineItems: LineItemDto[];

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => LoadAddressDto)
  sourceAddress: LoadAddressDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => LoadAddressDto)
  destinationAddress: LoadAddressDto;

  @IsNotEmpty()
  @IsNumber()
  priceRate: number;

  @IsNotEmpty()
  vehicleRequirement: string[];

  @IsOptional()
  @IsUUID()
  paymentTermId?: string;

  @IsNotEmpty()
  @IsNumber()
  advancePayment: number;

  @IsNotEmpty()
  @IsNumber()
  totalPrice: number;
}

export class LineItemDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsNotEmpty()
  @IsString()
  productName: string;

  @IsNotEmpty()
  @IsString()
  sku: string;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsEnum(WeightUnit)
  weightUnit?: WeightUnit;

  @IsOptional()
  @IsEnum(AdditionalMeasureUOM)
  additionalMeasureUOM?: AdditionalMeasureUOM;

  @IsOptional()
  @IsNumber()
  additionalMeasureValue?: number;
}

export class BookLoadDto {
  @IsNotEmpty()
  @IsUUID()
  loadId: string;

  @IsNotEmpty()
  @IsUUID()
  bookingId: string;
}
