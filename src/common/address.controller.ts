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
import { AddressService } from './address.service';
import { AddressDto } from './dto/address.dto';
import { Address } from './entities/address.entity';

@ApiTags('Address')
@Controller('address')
@TenantAuth()
@ApiBearerAuth()
export class AddressController {
  constructor(
    @Inject(AddressService)
    public addressService: AddressService,
  ) {}

  @Get()
  async getAddress(): Promise<Address[]> {
    return await this.addressService.getAddress(1000, 0, {});
  }

  @Get('/:id')
  async getAddressById(@Param('id') id: string): Promise<Address> {
    const result = await this.addressService.getAddress(1, 0, {
      ids: [id],
    });
    if (result.length == 0) throw new NotFoundException(`address not found`);
    return result[0];
  }

  @Post()
  async saveAddress(@Body() addressDto: AddressDto): Promise<Address> {
    return await this.addressService.saveAddress(addressDto);
  }

  @Put('/:id')
  async updateAddress(
    @Param('id') id: string,
    @Body() addressDto: AddressDto,
  ): Promise<Address> {
    return await this.addressService.saveAddress(addressDto, id);
  }

  @Delete('/:id')
  async deleteCustomerAddress(@Param('id') id: string) {
    return await this.addressService.deleteAddress([id]);
  }
}
