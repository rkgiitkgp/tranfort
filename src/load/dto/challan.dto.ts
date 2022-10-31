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
import { UnitOfMeasurement } from '../constant';
import { VehicleDto } from './vehicle.dto';

export class ChallanLineItemDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsNotEmpty()
  @IsString()
  productName: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsEnum(UnitOfMeasurement)
  uom?: UnitOfMeasurement;

  @IsOptional()
  @IsNumber()
  value?: number;
}
export class ChallanDto {
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChallanLineItemDto)
  challanLineItems: ChallanLineItemDto[];

  @IsNotEmpty()
  @IsUUID()
  loadId: string;

  @IsNotEmpty()
  @IsUUID()
  bookingId: string;

  @IsNotEmpty()
  @IsString()
  driverId: string;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  vehicle: VehicleDto;
}
