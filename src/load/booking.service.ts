import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { postgresErrorCode } from '../common/constant';
import { fillNull } from '../common/utils/repository';
import { In, Repository } from 'typeorm';
import { LoadStatus } from './constant';
import { BookingDto } from './dto/booking.dto';
import { Booking } from './entities/booking.entity';
import { LoadService } from './load.service';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private booking: Repository<Booking>,
    @Inject(LoadService)
    private loadService: LoadService,
  ) {}
  async getBookings(
    take: number,
    skip: number,
    filterBy: { ids?: string[]; loadIds?: string[] },
    relations: Array<'load'>,
  ): Promise<Booking[]> {
    const idFilter = filterBy.ids ? { id: In(fillNull(filterBy.ids)) } : {};
    const loadFilter = filterBy.loadIds
      ? { loadId: In(fillNull(filterBy.loadIds)) }
      : {};
    return await this.booking.find({
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

  async saveBookings(bookingDto: BookingDto, id?: string): Promise<Booking> {
    let bookingDao = new Booking();
    if (id) {
      const [result] = await this.getBookings(
        1,
        0,
        {
          ids: [id],
          loadIds: [bookingDto.loadId],
        },
        [],
      );
      if (!result) {
        throw new NotFoundException('Load Not Found');
      }
      bookingDao = result;
    }
    const [load] = await this.loadService.getLoads(1, 0, {
      ids: [bookingDto.loadId],
    });
    if (!load) {
      throw new NotFoundException('Load Not Found');
    }
    if (load.status == LoadStatus.BOOKED) {
      throw new BadRequestException('Load Already Been Booked');
    }
    bookingDao.loadId = load.id;
    bookingDao.comments = bookingDto.comments;
    try {
      return await this.booking.save(bookingDao);
    } catch (error) {
      if (error.code == postgresErrorCode.uniqueViolation) {
        throw new BadRequestException('Booking Already Applied');
      }
    }
  }

  async deleteBooking(id: string) {
    return await this.booking.update(
      { id },
      { deleted: true, createdBy: () => `CONCAT(created_by,id)` },
    );
  }
}
