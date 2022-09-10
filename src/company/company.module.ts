import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StateCityZipcodeModule } from '../state-city-zipcode/state-city-zipcode.module';
import { CompanyAddressController } from './company-address.controller';
import { CompanyAddressService } from './company-address.service';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { CompanyAddress } from './entities/company-address.entity';
import { Company } from './entities/company.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Company, CompanyAddress]),
    StateCityZipcodeModule,
  ],
  controllers: [CompanyController, CompanyAddressController],
  providers: [CompanyService, CompanyAddressService],
  exports: [CompanyService],
})
export class CompanyModule {}
