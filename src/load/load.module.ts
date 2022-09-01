import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StateCityZipcodeModule } from '../state-city-zipcode/state-city-zipcode.module';
import { LineItem } from './entities/line-item.entity';
import { LoadAddress } from './entities/load-address.entity';
import { Load } from './entities/load.entity';
import { LoadAddressController } from './load-address.controller';
import { LoadAddressService } from './load-address.service';
import { LoadController } from './load.controller';
import { LoadService } from './load.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Load, LoadAddress, LineItem]),
    StateCityZipcodeModule,
  ],
  controllers: [LoadAddressController, LoadController],
  providers: [LoadService, LoadAddressService],
})
export class LoadModule {}
