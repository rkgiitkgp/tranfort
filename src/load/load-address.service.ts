import { Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { fillNull } from '../common/utils/repository';
import { In, Repository } from 'typeorm';

import { ZipcodeService } from '../state-city-zipcode/zipcode.service';
import { getRequestContext } from '../common/request.context';
import { LoadAddressDto } from './dto/load-address.dto';
import { LoadAddress } from './entities/load-address.entity';

export class LoadAddressService {
  constructor(
    @InjectRepository(LoadAddress)
    public loadAddress: Repository<LoadAddress>,
    @Inject(ZipcodeService)
    public zipcodeService: ZipcodeService,
  ) {}

  async getLoadAddress(
    take,
    skip,
    filterBy: { ids?: string[] },
    relations?: [],
  ) {
    const idFilter = filterBy.ids ? { id: In(fillNull(filterBy.ids)) } : {};

    let result: any = await this.loadAddress.find({
      take,
      skip,
      where: [
        {
          deleted: false,
          ...idFilter,
        },
      ],
      relations,
    });
    const zipcodes = await this.zipcodeService.getZipcode(
      10000,
      0,
      {
        ids: result.map(address => address.zipcodeId),
      },
      ['city', 'city.state'],
    );

    result = result.map(loadAddress => {
      return {
        ...loadAddress,
        zipcode: zipcodes.find(z => z.id == loadAddress.zipcodeId),
      };
    });
    return result;
  }

  async saveLoadAddress(
    addressDto: LoadAddressDto,
    id?: string,
  ): Promise<LoadAddress> {
    let addressDao = new LoadAddress();
    if (id != undefined) {
      const result = await this.getLoadAddress(1, 0, {
        ids: [id],
      });
      if (result.length == 0)
        throw new NotFoundException(`load address not found`);
      addressDao = result[0];
    }

    addressDao.addressName = addressDto.address;
    addressDao.country = addressDto.country;
    if (addressDto.isInternational) {
      addressDao.isInternational = addressDto.isInternational;
    } else {
      const [zipcode] = await this.zipcodeService.getZipcode(
        1,
        0,
        {
          ids: [addressDto.zipcodeId],
        },
        ['city', 'city.state'],
      );

      addressDao.cityId = zipcode.cityId;
      addressDao.stateId = zipcode.city.stateId;
      addressDao.zipcodeId = zipcode.id;
    }

    if (addressDto.isDefault) {
      await this.setDefaultFalse({});
      addressDao.isDefault = addressDto.isDefault;
    }
    return await this.loadAddress.save(addressDao);
  }

  async setDefaultFalse(filterBy: { ids?: string[] }): Promise<number> {
    const userId = (await getRequestContext()).userId;
    let query = this.loadAddress
      .createQueryBuilder()
      .update()
      .where('deleted = false');
    query = query.andWhere('created_by = :userId', {
      userId,
    });

    if (filterBy.ids) {
      query = query.andWhere('id IN(:...ids)', {
        ids: fillNull(filterBy.ids),
      });
    }
    query = query.set({
      isDefault: false,
    });
    const result = await query.execute();
    return await result.affected;
  }

  async deleteLoadAddress(ids: [string]) {
    return await this.loadAddress.update(
      { id: In(fillNull(ids)) },
      { deleted: true },
    );
  }
}
