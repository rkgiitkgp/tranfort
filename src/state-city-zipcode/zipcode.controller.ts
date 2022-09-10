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
import { ZipcodeService } from './zipcode.service';
import { ZipcodeDto } from './dto/zipcode.dto';
import { Zipcode } from './entities/zipcode.entity';
import { TenantAuth } from '../auth/decorator/auth.decorator';
import { PaginatedResponse } from '../common/pagination';

@ApiTags('Zipcode')
@Controller('zipcode')
@TenantAuth()
@ApiBearerAuth()
export class ZipcodeController {
  constructor(
    @Inject(ZipcodeService) private readonly zipcodeService: ZipcodeService,
  ) {}

  @Get('/search')
  async searchZipcode(
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Query('texts') text: string,
  ): Promise<PaginatedResponse> {
    return await this.zipcodeService.searchZipcode(limit, page, text);
  }

  @Get()
  async getAllZipcode(@Query('cityId') cityId?: string): Promise<Zipcode[]> {
    return await this.zipcodeService.getZipcode(1000, 0, {
      cityIds: [cityId],
    });
  }

  @Get('/:id')
  async findZipcode(@Param('id') id: string): Promise<Zipcode[]> {
    return await this.zipcodeService.getZipcode(1, 0, { ids: [id] }, [
      'city',
      'city.state',
    ]);
  }

  @Post()
  async createZipcode(
    @Body(new ValidationPipe({ transform: true })) zipcode: ZipcodeDto,
  ): Promise<Zipcode> {
    return await this.zipcodeService.saveZipcode(zipcode);
  }

  @Put('/:id')
  async savezipcode(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true })) zipcode: ZipcodeDto,
  ): Promise<Zipcode> {
    return await this.zipcodeService.saveZipcode(zipcode, id);
  }

  @Delete('/:id')
  async deletezipcode(@Param('id') id: string) {
    await this.zipcodeService.deleteZipcode([id]);
  }
}
