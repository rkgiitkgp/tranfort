import { Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { fillNull } from '../common/utils/repository';
import { In, Repository } from 'typeorm';
import { CompanyService } from './company.service';
import { CompanyAddressDto } from './dto/company.dto';
import { CompanyAddress } from './entities/company-address.entity';
import { ZipcodeService } from '../state-city-zipcode/zipcode.service';

export class CompanyAddressService {
  constructor(
    @InjectRepository(CompanyAddress)
    public companyAddress: Repository<CompanyAddress>,
    @Inject(CompanyService)
    public companyService: CompanyService,
    @Inject(ZipcodeService)
    public zipcodeService: ZipcodeService,
  ) {}

  async getCompanyAddress(
    take,
    skip,
    filterBy: { ids?: string[]; companyIds?: string[] },
    relations?: Array<'companyContacts'>,
  ): Promise<any> {
    const idFilter = filterBy.ids ? { id: In(fillNull(filterBy.ids)) } : {};
    const companyIdFilter = filterBy.companyIds
      ? { companyId: In(fillNull(filterBy.companyIds)) }
      : {};
    let result: any = await this.companyAddress.find({
      take,
      skip,
      where: [
        {
          deleted: false,
          ...idFilter,
          ...companyIdFilter,
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

    result = result.map(companyAddress => {
      return {
        ...companyAddress,
        zipcode: zipcodes.find(z => z.id == companyAddress.zipcodeId),
      };
    });
    return result;
  }

  async saveCompanyAddress(
    addressDto: CompanyAddressDto,
    companyId: string,
    id?: string,
  ): Promise<CompanyAddress> {
    let addressDao = new CompanyAddress();
    if (id != undefined) {
      const result = await this.getCompanyAddress(1, 0, {
        ids: [id],
        companyIds: [companyId],
      });
      if (result.length == 0)
        throw new NotFoundException(`company address not found`);
      addressDao = result[0];
    }
    const company = await this.companyService.getCompany(
      { ids: [companyId] },
      [],
    );
    if (company.length == 0) throw new NotFoundException(`company not found`);

    addressDao.companyId = companyId;
    addressDao.addressName = addressDto.address;
    const [zipcode] = await this.zipcodeService.getZipcode(
      1,
      0,
      {
        ids: [addressDto.zipcodeId],
      },
      ['city', 'city.state'],
    );
    if (!zipcode && zipcode?.id !== addressDto.id) {
      throw new NotFoundException(`zipcode not found`);
    }
    addressDao.cityId = zipcode.cityId;
    addressDao.stateId = zipcode.city.stateId;
    addressDao.zipcodeId = zipcode.id;

    return await this.companyAddress.save(addressDao);
  }

  async deleteCompanyAddress(companyId: string, ids: [string]) {
    const companyAddress = await this.getCompanyAddress(1000, 0, {
      ids: ids,
      companyIds: [companyId],
    });
    if (companyAddress.length === 0) throw new NotFoundException();

    return await this.companyAddress.update(
      { id: In(fillNull(ids)), companyId: companyId },
      { deleted: true },
    );
  }
}
