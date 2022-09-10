import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TenantAuth } from '../auth/decorator/auth.decorator';
import { CityService } from './city.service';
import { CityDto } from './dto/city.dto';
import { City } from './entities/city.entity';

@ApiTags('City')
@Controller('city')
@TenantAuth()
@ApiBearerAuth()
export class CityController {
  constructor(@Inject(CityService) private readonly cityService: CityService) {}

  @Get()
  async getAllCity(@Query('stateId') stateId?: string): Promise<City[]> {
    return await this.cityService.getCity({
      stateIds: [stateId],
    });
  }

  @Get('/:id')
  async findCity(@Param('id') id: string): Promise<City[]> {
    return await this.cityService.getCity({ ids: [id] });
  }

  @Post()
  async createCity(
    @Body(new ValidationPipe({ transform: true })) city: CityDto,
  ) {
    return await this.cityService.saveCity(city);
  }

  @Put('/:id')
  async saveCity(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true })) city: CityDto,
  ) {
    await this.cityService.saveCity(city, id);
  }

  @Delete('/:id')
  async deleteCity(@Param('id') id: string) {
    await this.cityService.deleteCity([id]);
  }
}
