import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TenantAuth } from '../auth/decorator/auth.decorator';
import { CompanyService } from './company.service';
import { CompanyDto } from './dto/company.dto';
import { Company } from './entities/company.entity';

@ApiTags('Company')
@Controller('company')
@TenantAuth()
@ApiBearerAuth()
export class CompanyController {
  constructor(
    @Inject(CompanyService)
    private readonly companyService: CompanyService,
  ) {}

  @Get()
  async getAllCompany(): Promise<Company[]> {
    return await this.companyService.getCompany({}, []);
  }
  @Get('/:id')
  async getOneCompany(@Param('id') id: string): Promise<Company[]> {
    return await this.companyService.getCompany({ ids: [id] }, [
      'companyAddresses',
    ]);
  }
  @Post()
  async saveCompanyDetails(
    @Body(new ValidationPipe({ transform: true }))
    companyDto: CompanyDto,
  ): Promise<Company> {
    return await this.companyService.saveCompanyDetails(companyDto);
  }
  @Put('/:id')
  async updateCompanyDetails(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true }))
    companyDto: CompanyDto,
  ): Promise<Company> {
    return await this.companyService.saveCompanyDetails(companyDto, id);
  }

  @Delete('/:id')
  async deleteCompany(@Param('id') id: string) {
    return await this.companyService.deleteCompany([id]);
  }
}
