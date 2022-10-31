import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../users/user.module';
import { BootstrapService } from './bootstrap.service';
import { BootstrapController } from './bootstrap.controller';
import { CompanyModule } from '../company/company.module';
import { Address } from './entities/address.entity';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { StateCityZipcodeModule } from '../state-city-zipcode/state-city-zipcode.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Address]),
    UserModule,
    forwardRef(() => CompanyModule),
    StateCityZipcodeModule,
  ],
  controllers: [BootstrapController, AddressController],
  providers: [BootstrapService, AddressService],
  exports: [AddressService, BootstrapService],
})
export class CommonModule {}
