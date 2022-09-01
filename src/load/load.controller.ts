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
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoadDto } from './dto/load.dto';
import { Load } from './entities/load.entity';
import { LoadService } from './load.service';

@ApiTags('Load')
@Controller('load')
// @TenantAuth()
@ApiBearerAuth()
export class LoadController {
  constructor(
    @Inject(LoadService)
    private loadService: LoadService,
  ) {}
  @Get()
  async getLoads(): Promise<Load[]> {
    const result = await this.loadService.getLoads(100, 0, {}, [
      'lineItems',
      'sourceAddress',
      'destinationAddress',
    ]);
    return result;
  }

  @Get('/:id')
  async getLoad(@Param('id', new ParseUUIDPipe()) id: string): Promise<Load[]> {
    const result = await this.loadService.getLoads(
      100,
      0,

      {
        ids: [id],
      },
      ['lineItems', 'sourceAddress', 'destinationAddress'],
    );
    if (result.length == 0) throw new NotFoundException();
    return result;
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
