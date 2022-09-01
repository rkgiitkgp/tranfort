import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { VehicleDto } from './dto/vehicle.dto';
import { Vehicle } from './entities/vehicle.entity';
import { VehicleService } from './vehicle.service';

@Controller('vehicle')
@ApiTags('Vehicle')
@ApiBearerAuth()
export class VehicleController {
  constructor(
    @Inject(VehicleService)
    private vehicleService: VehicleService,
  ) {}

  @Post()
  async create(@Body() vehicleDto: VehicleDto): Promise<Vehicle> {
    return await this.vehicleService.create(vehicleDto);
  }

  @Put()
  async update(
    @Param('id') id: string,
    @Body() vehicleDto: VehicleDto,
  ): Promise<Vehicle> {
    return await this.vehicleService.create(vehicleDto, id);
  }

  @Get()
  async findAll(): Promise<Vehicle[]> {
    return await this.vehicleService.findAll();
  }
  @Get('/:id')
  async findOne(@Inject('id') id: string): Promise<Vehicle> {
    return await this.vehicleService.findOne(id);
  }
  @Delete('/:id')
  async delete(@Inject('id') id: string): Promise<void> {
    return await this.vehicleService.delete(id);
  }
}
