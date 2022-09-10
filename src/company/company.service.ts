import { Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { fillNull } from '../common/utils/repository';
import { In, Repository } from 'typeorm';
import { CompanyDto } from './dto/company.dto';
import { Company } from './entities/company.entity';
import { CompanyAddress } from './entities/company-address.entity';
import { ZipcodeService } from '../state-city-zipcode/zipcode.service';

export class CompanyService {
  constructor(
    @InjectRepository(Company)
    public company: Repository<Company>,
    @Inject(ZipcodeService)
    public zipcodeService: ZipcodeService,
  ) {}
  async getCompany(
    filterBy: {
      ids?: string[];
      userIds?: string[];
    },
    relations: Array<'companyAddresses'>,
  ): Promise<Company[]> {
    const idFilter = filterBy.ids ? { id: In(fillNull(filterBy.ids)) } : {};
    const userFilter = filterBy.userIds
      ? { createdBy: In(fillNull(filterBy.userIds)) }
      : {};

    return await this.company.find({
      where: [
        {
          deleted: false,
          ...idFilter,
          ...userFilter,
        },
      ],
      relations,
    });
  }

  async saveCompanyDetails(
    companyDto: CompanyDto,
    id?: string,
  ): Promise<Company> {
    let companyDao = new Company();
    if (id != undefined) {
      const result = await this.getCompany({ ids: [id] }, ['companyAddresses']);
      if (result.length === 0)
        throw new NotFoundException(`Company id ${id} does not exist`);
      companyDao = result[0];
    }
    companyDao.adharNumber = companyDto.adharNumber;
    companyDao.category = companyDto.category;
    companyDao.description = companyDto.description;
    companyDao.panNumber = companyDto.panNumber;
    const companyAddress = new CompanyAddress();
    companyAddress.addressName = companyDto.companyAddress.address;
    const [zipcode] = await this.zipcodeService.getZipcode(
      1,
      0,
      {
        ids: [companyDto.companyAddress.zipcodeId],
      },
      ['city', 'city.state'],
    );
    if (!zipcode) {
      throw new NotFoundException(`zipcode not found`);
    }
    companyAddress.cityId = zipcode.cityId;
    companyAddress.stateId = zipcode.city.stateId;
    companyAddress.zipcodeId = zipcode.id;
    companyDao.companyAddresses = [companyAddress];

    return await this.company.save(companyDao);
  }

  async deleteCompany(ids: string[]) {
    return await this.company.update(
      { id: In(fillNull(ids)) },
      {
        deleted: true,
        panNumber: () => `CONCAT(pan_number,id)`,
      },
    );
  }
}
