import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityController } from './city.controller';
import { CityService } from './city.service';
import { City } from './entities/city.entity';
import { State } from './entities/state.entity';
import { Zipcode } from './entities/zipcode.entity';
import { StateController } from './state.controller';
import { StateService } from './state.service';
import { ZipcodeController } from './zipcode.controller';
import { ZipcodeService } from './zipcode.service';

@Module({
  imports: [TypeOrmModule.forFeature([State, City, Zipcode])],
  controllers: [StateController, CityController, ZipcodeController],
  providers: [StateService, CityService, ZipcodeService],
  exports: [CityService, StateService, ZipcodeService],
})
export class StateCityZipcodeModule {}
