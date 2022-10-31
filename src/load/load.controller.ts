import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { QueryDto } from '../common/dto/query.dto';
import { PaginatedResponse } from '../common/pagination';
import { TenantAuth } from '../auth/decorator/auth.decorator';
import { LoadStatus } from './constant';
import { BookLoadDto, LoadDto, LoadFilterDto } from './dto/load.dto';
import { Load } from './entities/load.entity';
import { LoadService } from './load.service';
import { UpdateResult } from 'typeorm';

@ApiTags('Load')
@Controller('load')
@TenantAuth()
@ApiBearerAuth()
export class LoadController {
  constructor(
    @Inject(LoadService)
    private loadService: LoadService,
  ) {}

  @Post('/update-status/:id')
  async updateStatus(@Param('id') id: string): Promise<UpdateResult> {
    return await this.loadService.updateLoadStatus(id, LoadStatus.BOOKED);
  }

  @Post('/list')
  async getLoadList(
    @Body(new ValidationPipe()) query: QueryDto,
    @Query() loadFilterDto: LoadFilterDto,
  ) {
    const limit = loadFilterDto.limit;
    const page = loadFilterDto.page;
    const userIdFilter =
      loadFilterDto.createdBy && loadFilterDto.createdBy != 'undefined'
        ? { createdBy: loadFilterDto.createdBy }
        : {};
    let statusFilter = {};
    if (loadFilterDto.publicLoad) {
      statusFilter = { status: [LoadStatus.GENERATED] };
    }
    if (loadFilterDto?.activeLoad == 'true') {
      statusFilter = {
        staus: [LoadStatus.GENERATED, LoadStatus.BOOKED],
      };
    }
    if (loadFilterDto?.inActiveLoad == 'true') {
      statusFilter = {
        staus: [LoadStatus.CANCELLED],
      };
    }

    const loads = await this.loadService.getLoadList(
      { take: limit, page },
      { ...userIdFilter, ...statusFilter },
      query,
    );
    const result = await this.loadService.enrichLoad(loads.data);
    return [result, loads.page];
  }

  @Post('/assign-load')
  async assignLoad(
    @Body(new ValidationPipe({ transform: true })) bookLoadDto: BookLoadDto,
  ): Promise<boolean> {
    return await this.loadService.assignLoad(bookLoadDto);
  }

  @Get()
  async getLoads(): Promise<any> {
    const result = await this.loadService.getLoads(100, 0, {}, [
      'bookings',
      'destinationAddress',
      'lineItems',
      'sourceAddress',
      'user',
      'bookings.user',
    ]);
    return await this.loadService.enrichLoad(result);
  }

  @Get('/:id')
  async getLoad(@Param('id', new ParseUUIDPipe()) id: string): Promise<Load> {
    const [result] = await this.loadService.getLoads(
      100,
      0,
      {
        ids: [id],
      },
      [
        'bookings',
        'destinationAddress',
        'lineItems',
        'sourceAddress',
        'user',
        'bookings.user',
      ],
    );
    if (!result) throw new NotFoundException('load not found');
    return (await this.loadService.enrichLoad([result]))[0];
  }

  @Post()
  async createLoad(@Body() loadDto: LoadDto): Promise<Load> {
    return await this.loadService.saveLoad(loadDto);
  }

  @Put('/:id')
  async saveLoad(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() loadDto: LoadDto,
  ): Promise<Load> {
    return await this.loadService.saveLoad(loadDto, id);
  }

  @Delete('/:id')
  async deleteLoad(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.loadService.deleteLoad([id]);
  }
}
