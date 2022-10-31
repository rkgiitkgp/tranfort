import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { fillNull } from '../common/utils/repository';
import { In, Repository } from 'typeorm';
import { LoadService } from './load.service';
import { UserService } from '../users/user.service';
import { UserType } from '../users/constant';
import { Challan } from './entities/challan.entity';
import { ChallanDto } from './dto/challan.dto';
import { BookingService } from './booking.service';
import { ChallanLineItem } from './entities/challan-line-item.entity';
import { ChallanEnum } from './constant';

@Injectable()
export class ChallanService {
  constructor(
    @InjectRepository(Challan)
    private challan: Repository<Challan>,
    @Inject(LoadService)
    private loadService: LoadService,
    @Inject(BookingService)
    private bookingService: BookingService,
    private userService: UserService,
  ) {}
  async getChallan(
    take: number,
    skip: number,
    filterBy: { ids?: string[]; loadIds?: string[]; createdBy?: string },
    relations: Array<
      | 'challanLineItems'
      | 'load'
      | 'load.user'
      | 'load.sourceAddress'
      | 'load.destinationAddress'
      | 'load.lineItems'
    >,
  ): Promise<Challan[]> {
    const idFilter = filterBy.ids ? { id: In(fillNull(filterBy.ids)) } : {};
    const loadFilter = filterBy.loadIds
      ? { loadId: In(fillNull(filterBy.loadIds)) }
      : {};
    return await this.challan.find({
      take,
      skip,
      where: [
        {
          ...idFilter,
          ...loadFilter,
        },
      ],
      relations,
    });
  }

  async saveChallan(challanDto: ChallanDto, id?: string): Promise<Challan> {
    let challanDao = new Challan();
    if (id) {
      const [result] = await this.getChallan(
        1,
        0,
        {
          ids: [id],
        },
        [],
      );
      if (!result) {
        throw new NotFoundException('Challan Not Found');
      }
      challanDao = result;
    }
    const userProfile = await this.userService.getUserProfile();
    if (userProfile.type !== UserType.TRANSPORTER) {
      throw new BadRequestException('User Does Not have Challan access');
    }
    const [load] = await this.loadService.getLoads(
      1,
      0,
      {
        createdBy: userProfile.id,
        ids: [challanDto.loadId],
      },
      [],
    );
    if (!load) {
      throw new NotFoundException('Load Not Found');
    }
    challanDao.loadId = load.id;
    const [booking] = await this.bookingService.getBookings(
      1,
      0,
      {
        ids: [challanDto.bookingId],
      },
      [],
    );
    if (!booking) {
      throw new NotFoundException('booking not found');
    }
    challanDao.bookingId = challanDto.bookingId;

    challanDao.challanLineItems = challanDto.challanLineItems.map(i => {
      const lineItem = new ChallanLineItem();
      lineItem.productName = i.productName;
      lineItem.uom = i.uom;
      lineItem.value = i.value;
      return lineItem;
    });
    //todo: driver flow
    challanDao.driverId = challanDto.driverId;
    challanDao.vehicle = challanDto.vehicle;
    challanDao.status = ChallanEnum.GENERATED;
    try {
      return await this.challan.save(challanDao);
    } catch (error) {
      console.log(error);
    }
  }

  async deleteChallan(id: string) {
    return await this.challan.update(
      { id },
      { deleted: true, createdBy: () => `CONCAT(created_by,id)` },
    );
  }
}
