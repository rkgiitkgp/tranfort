import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../users/user.module';
import { StateCityZipcodeModule } from '../state-city-zipcode/state-city-zipcode.module';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { Booking } from './entities/booking.entity';
import { LineItem } from './entities/line-item.entity';
import { LoadAddress } from './entities/load-address.entity';
import { Load } from './entities/load.entity';
import { LoadAddressController } from './load-address.controller';
import { LoadAddressService } from './load-address.service';
import { LoadController } from './load.controller';
import { LoadService } from './load.service';
import { Challan } from './entities/challan.entity';
import { ChallanController } from './challan.controller';
import { ChallanService } from './challan.service';
import { ChallanLineItem } from './entities/challan-line-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Load,
      LoadAddress,
      LineItem,
      Booking,
      Challan,
      ChallanLineItem,
    ]),
    StateCityZipcodeModule,
    UserModule,
  ],
  controllers: [
    LoadAddressController,
    LoadController,
    BookingController,
    ChallanController,
  ],
  providers: [LoadService, LoadAddressService, BookingService, ChallanService],
})
export class LoadModule {}
