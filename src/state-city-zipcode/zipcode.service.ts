import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { sendError } from '../common/error.service';
import { Page, PaginatedResponse } from '../common/pagination';
import { In, Repository } from 'typeorm';
import { fillNull } from '../common/utils/repository';
import { CityService } from './city.service';
import { ZipcodeDto } from './dto/zipcode.dto';
import { Zipcode } from './entities/zipcode.entity';

@Injectable()
export class ZipcodeService {
  constructor(
    @InjectRepository(Zipcode) public zipcode: Repository<Zipcode>,
    @Inject(CityService)
    public cityService: CityService,
  ) {}

  async searchZipcode(
    take: number,
    page: number,
    text: string,
  ): Promise<PaginatedResponse> {
    const skip = take * (page - 1);
    if (take > 100) take = 100;

    const zipcodeBaseQuery = await this.zipcode
      .createQueryBuilder('zipcode')
      .select(['zipcode.id'])
      .addOrderBy('zipcode.code', 'ASC')
      .where('zipcode.deleted= :del', { del: false })
      .andWhere(`to_tsvector('simple',code) @@ to_tsquery('simple',:query)`, {
        query: `${text}:*`,
      });

    const zipcodeCount = await zipcodeBaseQuery.getCount();

    const zipcode = await zipcodeBaseQuery
      .limit(take)
      .offset(skip)
      .getMany();
    const result = await this.getZipcode(
      take,
      0,
      {
        ids: zipcode.map(r => r.id),
      },
      ['city', 'city.state'],
    );

    const pageData = new Page(zipcodeCount, page, take);
    return new PaginatedResponse(result, pageData);
  }

  async getZipcode(
    take: number,
    skip: number,
    filterBy: {
      ids?: string[];
      cityIds?: string[];
      code?: string[];
    },
    relations?: Array<'city' | 'city.state'>,
  ): Promise<Zipcode[]> {
    const idFilter = filterBy.ids ? { id: In(fillNull(filterBy.ids)) } : {};

    const cityFilter = filterBy.cityIds
      ? { cityId: In(fillNull(filterBy.cityIds)) }
      : {};
    const codeFilter = filterBy.code
      ? { code: In(fillNull(filterBy.code)) }
      : {};
    return await this.zipcode.find({
      take,
      skip,
      where: [
        {
          deleted: false,
          ...idFilter,
          ...cityFilter,
          ...codeFilter,
        },
      ],
      order: { code: 'ASC' },
      relations,
    });
  }

  async saveZipcode(zipcodeDto: ZipcodeDto, id?: string): Promise<Zipcode> {
    const zipcodeDao = new Zipcode();
    if (id != undefined) zipcodeDao.id = id;
    zipcodeDao.code = zipcodeDto.code;
    const city = await this.cityService.getCity({ ids: [zipcodeDto.cityId] });
    if (city.length == 0) throw new NotFoundException('City does not exist');

    zipcodeDao.cityId = zipcodeDto.cityId;
    try {
      return await zipcodeDao.save();
    } catch (error) {
      sendError(error, 'zipcode');
    }
  }

  async deleteZipcode(ids: string[]) {
    return await this.zipcode.update(
      { id: In(fillNull(ids)) },
      { deleted: true },
    );
  }
}
