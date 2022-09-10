import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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

@Module({
  imports: [
    TypeOrmModule.forFeature([Load, LoadAddress, LineItem, Booking]),
    StateCityZipcodeModule,
  ],
  controllers: [LoadAddressController, LoadController, BookingController],
  providers: [LoadService, LoadAddressService, BookingService],
})
export class LoadModule {}
