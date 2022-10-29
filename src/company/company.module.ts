import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StateCityZipcodeModule } from '../state-city-zipcode/state-city-zipcode.module';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { Company } from './entities/company.entity';
import { CommonModule } from '../common/common.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Company]),
    forwardRef(() => CommonModule),
    StateCityZipcodeModule,
  ],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompanyModule {}
