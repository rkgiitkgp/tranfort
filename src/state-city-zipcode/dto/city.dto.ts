import { IsNotEmpty, IsUUID } from 'class-validator';

export class CityDto {
  @IsNotEmpty()
  name: string;

  @IsUUID()
  @IsNotEmpty()
  stateId: string;
}
