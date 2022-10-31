import { Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { fillNull } from './utils/repository';
import { In, Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { ZipcodeService } from '../state-city-zipcode/zipcode.service';
import { AddressDto } from './dto/address.dto';

export class AddressService {
  constructor(
    @InjectRepository(Address)
    public address: Repository<Address>,
    @Inject(ZipcodeService)
    public zipcodeService: ZipcodeService,
  ) {}

  async getAddress(
    take,
    skip,
    filterBy: { ids?: string[]; entityIds?: string[] },
  ): Promise<any> {
    const idFilter = filterBy.ids ? { id: In(fillNull(filterBy.ids)) } : {};
    const entityIdFilter = filterBy.entityIds
      ? { entityId: In(fillNull(filterBy.entityIds)) }
      : {};
    let result: any = await this.address.find({
      take,
      skip,
      where: [
        {
          deleted: false,
          ...idFilter,
          ...entityIdFilter,
        },
      ],
    });
    const zipcodes = await this.zipcodeService.getZipcode(
      10000,
      0,
      {
        ids: result.map(address => address.zipcodeId),
      },
      ['city', 'city.state'],
    );

    result = result.map(address => {
      return {
        ...address,
        zipcode: zipcodes.find(z => z.id == address.zipcodeId),
      };
    });
    return result;
  }

  async saveAddress(addressDto: AddressDto, id?: string): Promise<Address> {
    let addressDao = new Address();
    if (id != undefined) {
      const result = await this.getAddress(1, 0, {
        ids: [id],
      });
      if (result.length == 0) throw new NotFoundException(` address not found`);
      addressDao = result[0];
    }
    addressDao.addressName = addressDto.address;
    const [zipcode] = await this.zipcodeService.getZipcode(
      1,
      0,
      {
        ids: [addressDto.zipcodeId],
      },
      ['city', 'city.state'],
    );
    if (!zipcode) {
      throw new NotFoundException(`zipcode not found`);
    }
    addressDao.cityId = zipcode.cityId;
    addressDao.stateId = zipcode.city.stateId;
    addressDao.zipcodeId = zipcode.id;
    addressDao.entityId = addressDto.entityId;

    return await this.address.save(addressDao);
  }

  async deleteAddress(ids: [string]) {
    return await this.address.update(
      { id: In(fillNull(ids)) },
      { deleted: true },
    );
  }
}
