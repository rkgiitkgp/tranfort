import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { SubVehicleType, UnitOfMeasurement, VehicleType } from '../constant';
import { LoadAddressDto } from './load-address.dto';
export class NumberOfWheels {
  number: number;
}
export class VehicleRequirementDto {
  vehicleType: VehicleType;
  subVehicleType: SubVehicleType;
  numberOfWheels: NumberOfWheels[];
}
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

  @IsOptional()
  @IsNumber()
  priceRate: number;

  @IsNotEmpty()
  vehicleRequirement: VehicleRequirementDto;

  @IsOptional()
  @IsUUID()
  paymentTermId?: string;

  @IsOptional()
  @IsNumber()
  advancePayment?: number;

  @IsOptional()
  @IsNumber()
  advanceInPercentage?: number;

  @IsOptional()
  @IsNumber()
  totalPrice: number;

  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @IsOptional()
  @IsString()
  additionalNotes: string;
}

export class LineItemDto {
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

export class BookLoadDto {
  @IsNotEmpty()
  @IsUUID()
  loadId: string;

  @IsNotEmpty()
  @IsUUID()
  bookingId: string;
}

export class LoadFilterDto {
  @IsNotEmpty()
  limit: number;

  @IsNotEmpty()
  page: number;

  @IsOptional()
  createdBy?: string;

  @IsOptional()
  publicLoad?: string;

  @IsOptional()
  activeLoad?: string;

  @IsOptional()
  inActiveLoad?: string;
}
