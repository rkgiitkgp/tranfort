import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { sendError } from '../common/error.service';
import { fillNull, RepoUtils } from '../common/utils/repository';
import { In, Repository } from 'typeorm';
import { Load } from './entities/load.entity';
import { BookLoadDto, LoadDto } from './dto/load.dto';
import { LoadAddressService } from './load-address.service';
import { LoadStatus } from './constant';
import { LineItem } from './entities/line-item.entity';
import { Booking } from './entities/booking.entity';
import { QueryDto } from '../common/dto/query.dto';
import { Page, PaginatedResponse } from '../common/pagination';
import { UserService } from '../users/user.service';
import { UserType } from '../users/constant';
import { ZipcodeService } from '../state-city-zipcode/zipcode.service';

@Injectable()
export class LoadService {
  constructor(
    @InjectRepository(Load)
    private load: Repository<Load>,
    @InjectRepository(Booking)
    private booking: Repository<Booking>,
    @Inject(LoadAddressService)
    private loadAddressService: LoadAddressService,
    private userService: UserService,
    private zipcodeServic: ZipcodeService,
  ) {}

  async assignLoad(bookLoadDto: BookLoadDto): Promise<boolean> {
    const [load] = await this.getLoads(1, 0, { ids: [bookLoadDto.loadId] }, [
      'bookings',
    ]);
    if (!load) {
      throw new NotFoundException('Load Not Found');
    }
    if (!load.bookings.find(b => b.id == bookLoadDto.bookingId)) {
      throw new NotFoundException('Booking Not Found');
    }
    if (load.status !== LoadStatus.GENERATED) {
      throw new BadRequestException('Load is Not In Generated');
    }
    const booking = load.bookings.find(b => b.id == bookLoadDto.bookingId);
    const updatedBooking = await this.booking.update(
      { loadId: load.id, id: booking.id },
      { confirmation: true },
    );
    if (updatedBooking) {
      await this.load.update({ id: load.id }, { status: LoadStatus.BOOKED });
      return true;
    }
    return false;
  }
  async getLoads(
    take: number,
    skip: number,
    filterBy: {
      ids?: string[];
      createdBy?: string;
      status?: LoadStatus[];
    },
    relations?: Array<
      | 'sourceAddress'
      | 'destinationAddress'
      | 'lineItems'
      | 'bookings'
      | 'user'
      | 'bookings.user'
    >,
    orderBy?: {
      asc?: string[];
      desc?: string[];
    },
  ): Promise<Load[]> {
    const userProfile = await this.userService.getUserProfile();
    let createdByFilter = {};
    let statusFilter = {};
    if (userProfile.type == UserType.TRANSPORTER) {
      createdByFilter = { createdBy: userProfile.id };
    }
    // else if (userProfile.type == UserType.TRUCK_OWNER) {
    //   statusFilter = { status: LoadStatus.GENERATED };
    // }
    const idFilter = filterBy.ids ? { id: In(fillNull(filterBy.ids)) } : {};
    if (filterBy.createdBy) {
      createdByFilter = { createdBy: filterBy.createdBy };
    }
    if (filterBy.status) {
      statusFilter = { status: In(fillNull(filterBy.status)) };
    }

    let loads: Load[];
    loads = await this.load.find({
      take,
      skip,
      where: [
        {
          deleted: false,
          ...idFilter,
          ...createdByFilter,
          ...statusFilter,
        },
      ],
      relations,
      order: RepoUtils.generateOrderBy(orderBy),
    });
    if (userProfile.type == UserType.TRUCK_OWNER) {
      loads = loads.map(load => {
        load.bookings = load.bookings.filter(
          booking => booking.createdBy == userProfile.id,
        );
        return load;
      });
    }
    return loads;
  }

  async enrichLoad(loads: any) {
    const zipcodeIds: Set<string> = new Set();
    loads.map(load => {
      if (load.destinationAddress) {
        zipcodeIds.add(load.destinationAddress.zipcodeId);
      }
      if (load.sourceAddress) {
        zipcodeIds.add(load.sourceAddress.zipcodeId);
      }
    });
    const zipcodes = await this.zipcodeServic.getZipcode(
      1000,
      0,
      {
        ids: Array.from(zipcodeIds),
      },
      ['city', 'city.state'],
    );
    return loads.map(load => {
      const destinationZipcode = zipcodes.find(
        z => load.destinationAddress.zipcodeId == z.id,
      );
      const sourceZipcode = zipcodes.find(
        z => load.sourceAddress.zipcodeId == z.id,
      );
      return {
        ...load,
        destinationAddress: {
          ...load.destinationAddress,
          destinationZipcode,
        },
        sourceAddress: {
          ...load.sourceAddress,
          sourceZipcode,
        },
      };
    });
  }

  async getLoadList(
    limit: {
      take?: number;
      page?: number;
    },
    filterBy: {
      createdBy?: string;
      status?: LoadStatus[];
    },
    query?: QueryDto,
  ): Promise<PaginatedResponse> {
    let take = limit.take ? limit.take : 20;
    const skip = limit.page ? limit.take * (limit.page - 1) : 0;
    if (take > 100) take = 100;
    const userProfile = await this.userService.getUserProfile();
    let createdByFilter = {};
    let statusFilter = {};
    if (userProfile.type == UserType.TRANSPORTER) {
      createdByFilter = { createdBy: userProfile.id };
    } else if (userProfile.type == UserType.TRUCK_OWNER) {
      statusFilter = { status: LoadStatus.GENERATED };
    }
    createdByFilter = filterBy.createdBy
      ? { createdBy: filterBy.createdBy }
      : {};
    statusFilter = filterBy.status
      ? { status: In(fillNull(filterBy.status)) }
      : {};

    const loadCount = await this.load.count({
      deleted: false,
      ...createdByFilter,
      ...statusFilter,
    });
    const loads = await this.getLoads(
      take,
      skip,
      { ...filterBy },
      [
        'bookings',
        'destinationAddress',
        'lineItems',
        'sourceAddress',
        'user',
        'bookings.user',
      ],
      QueryDto.transformToQuery(query),
    );
    const page = new Page(await loadCount, limit.page, limit.take);
    return new PaginatedResponse(loads, page);
  }

  async saveLoad(loadDto: LoadDto, id?: string): Promise<Load> {
    let loadDao = new Load();
    if (id) {
      const loadResult = await this.getLoads(1, 0, {
        ids: [id],
      });
      if (loadResult.length == 0) throw new NotFoundException();
      loadDao = loadResult[0];
    }
    loadDao.lineItems = loadDto.lineItems.map(i => {
      const lineItem = new LineItem();
      lineItem.productName = i.productName;
      lineItem.uom = i.uom;
      lineItem.value = i.value;
      return lineItem;
    });

    loadDao.sourceAddressId = (
      await this.loadAddressService.saveLoadAddress(loadDto.sourceAddress)
    )?.id;

    loadDao.destinationAddressId = (
      await this.loadAddressService.saveLoadAddress(loadDto.destinationAddress)
    )?.id;
    loadDao.paymentTermId = loadDto.paymentTermId;
    loadDao.advancePayment = loadDto.advancePayment;
    loadDao.advanceInPercentage = loadDto.advanceInPercentage;
    loadDao.priceRate = loadDto.priceRate;
    loadDao.totalPrice = loadDto.totalPrice;
    loadDao.vehicleRequirement = loadDto.vehicleRequirement;
    loadDao.status = LoadStatus.GENERATED;
    loadDao.startDate = loadDto.startDate;
    loadDao.endDate = loadDto.endDate;

    try {
      return await this.load.save(loadDao);
    } catch (error) {
      sendError(error, ' load');
    }
  }

  async deleteLoad(ids: string[]) {
    return await this.load.update(
      { id: In(fillNull(ids)) },
      {
        deleted: true,
      },
    );
  }
}
