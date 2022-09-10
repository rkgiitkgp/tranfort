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
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TenantAuth } from '../auth/decorator/auth.decorator';
import { CompanyAddressService } from './company-address.service';
import { CompanyAddressDto } from './dto/company.dto';
import { CompanyAddress } from './entities/company-address.entity';

@ApiTags('Company Address')
@Controller('company-address')
@TenantAuth()
@ApiBearerAuth()
export class CompanyAddressController {
  constructor(
    @Inject(CompanyAddressService)
    public companyAddressService: CompanyAddressService,
  ) {}

  @Get()
  async getCompanyAddress(
    @Query('companyId') companyId?: string,
  ): Promise<CompanyAddress[]> {
    return await this.companyAddressService.getCompanyAddress(
      1000,
      0,
      {
        companyIds: [companyId],
      },
      ['companyContacts'],
    );
  }

  @Get('/:id')
  async getCompanyAddressById(
    @Param('id') id: string,
    @Query('companyId') companyId: string,
  ): Promise<CompanyAddress> {
    const result = await this.companyAddressService.getCompanyAddress(
      1,
      0,
      { ids: [id], companyIds: [companyId] },
      ['companyContacts'],
    );
    if (result.length == 0) throw new NotFoundException(`address not found`);
    return result[0];
  }

  @Post()
  async saveAddress(
    @Query('companyId') companyId: string,
    @Body() companyAddressDto: CompanyAddressDto,
  ): Promise<CompanyAddress> {
    return await this.companyAddressService.saveCompanyAddress(
      companyAddressDto,
      companyId,
    );
  }

  @Put('/:id')
  async updateAddress(
    @Param('id') id: string,
    @Query('companyId') companyId: string,
    @Body() companyAddressDto: CompanyAddressDto,
  ): Promise<CompanyAddress> {
    return await this.companyAddressService.saveCompanyAddress(
      companyAddressDto,
      companyId,
      id,
    );
  }

  @Delete('/:id')
  async deleteCustomerAddress(
    @Param('id') id: string,
    @Query('companyId') companyId: string,
  ) {
    return await this.companyAddressService.deleteCompanyAddress(companyId, [
      id,
    ]);
  }
}
