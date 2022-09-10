import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TenantAuth } from '../auth/decorator/auth.decorator';
import { LoadAddressDto } from './dto/load-address.dto';
import { LoadAddress } from './entities/load-address.entity';

import { LoadAddressService } from './load-address.service';

@ApiTags('Load Address')
@Controller('load-address')
@TenantAuth()
@ApiBearerAuth()
export class LoadAddressController {
  constructor(
    @Inject(LoadAddressService)
    public loadAddressService: LoadAddressService,
  ) {}

  @Get()
  async getLoadAddress(): Promise<LoadAddress[]> {
    return await this.loadAddressService.getLoadAddress(1000, 0, {}, []);
  }

  @Get('/:id')
  async getLoadAddressById(@Param('id') id: string): Promise<LoadAddress> {
    const result = await this.loadAddressService.getLoadAddress(
      1,
      0,
      { ids: [id] },
      [],
    );
    if (result.length == 0) throw new NotFoundException(`address not found`);
    return result[0];
  }

  @Post()
  async saveAddress(
    @Body() loadAddressDto: LoadAddressDto,
  ): Promise<LoadAddress> {
    return await this.loadAddressService.saveLoadAddress(loadAddressDto);
  }

  @Put('/:id')
  async updateAddress(
    @Param('id') id: string,

    @Body() loadAddressDto: LoadAddressDto,
  ): Promise<LoadAddress> {
    return await this.loadAddressService.saveLoadAddress(loadAddressDto, id);
  }

  @Delete('/:id')
  async deleteLoadAddress(@Param('id') id: string) {
    return await this.loadAddressService.deleteLoadAddress([id]);
  }
}
