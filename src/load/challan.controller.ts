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
import { TenantAuth } from '../auth/decorator/auth.decorator';
import { ChallanService } from './challan.service';
import { ChallanDto } from './dto/challan.dto';
import { Challan } from './entities/challan.entity';

@ApiTags('Challan')
@Controller('challan')
@TenantAuth()
@ApiBearerAuth()
export class ChallanController {
  constructor(
    @Inject(ChallanService)
    private challanService: ChallanService,
  ) {}
  @Get()
  async getAllChallan(): Promise<Challan[]> {
    const result = await this.challanService.getChallan(100, 0, {}, []);
    return result;
  }

  @Get('/:id')
  async getChallan(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Challan[]> {
    const result = await this.challanService.getChallan(
      100,
      0,
      {
        ids: [id],
      },
      [],
    );
    if (result.length == 0) throw new NotFoundException();
    return result;
  }

  @Post()
  async createChallan(@Body() challanDto: ChallanDto): Promise<Challan> {
    return await this.challanService.saveChallan(challanDto);
  }

  @Put('/:id')
  async saveChallan(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() challanDto: ChallanDto,
  ): Promise<Challan> {
    return await this.challanService.saveChallan(challanDto, id);
  }

  @Delete('/:id')
  async deleteChallan(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.challanService.deleteChallan(id);
  }
}
