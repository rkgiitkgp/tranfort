import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { sendError } from '../common/error.service';
import { In, Repository } from 'typeorm';
import { fillNull } from '../common/utils/repository';
import { CityDto } from './dto/city.dto';
import { City } from './entities/city.entity';
import { StateService } from './state.service';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(City) public city: Repository<City>,
    @Inject(StateService)
    public stateService: StateService,
  ) {}

  async getCity(
    filterBy: {
      ids?: string[];
      stateIds?: string[];
    },
    relations?: Array<'state'>,
  ): Promise<City[]> {
    const idFilter = filterBy.ids ? { id: In(fillNull(filterBy.ids)) } : {};
    const stateFilter = filterBy.stateIds
      ? { stateId: In(fillNull(filterBy.stateIds)) }
      : {};

    return await this.city.find({
      where: [
        {
          deleted: false,
          ...idFilter,
          ...stateFilter,
        },
      ],
      relations,
      order: { name: 'ASC' },
    });
  }

  async saveCity(cityDto: CityDto, id?: string): Promise<City> {
    let cityDao = new City();
    if (id != undefined) {
      const city = await this.getCity({ ids: [id] });
      if (city.length == 0) throw new NotFoundException();
      cityDao = city[0];
    }
    cityDao.name = cityDto.name;
    const state = await this.stateService.getState({ ids: [cityDto.stateId] });
    if (state.length == 0) throw new NotFoundException('State does not exist');
    cityDao.stateId = cityDto.stateId;

    try {
      return await cityDao.save();
    } catch (error) {
      sendError(error, 'city');
    }
  }

  async deleteCity(ids: string[]) {
    return await this.city.update({ id: In(fillNull(ids)) }, { deleted: true });
  }
}
