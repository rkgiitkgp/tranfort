import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { sendError } from '../common/error.service';
import { fillNull } from '../common/utils/repository';
import { In, Repository } from 'typeorm';
import { Load } from './entities/load.entity';
import { BookLoadDto, LoadDto } from './dto/load.dto';
import { LoadAddressService } from './load-address.service';
import { LoadStatus } from './constant';
import { LineItem } from './entities/line-item.entity';
import { Booking } from './entities/booking.entity';

@Injectable()
export class LoadService {
  constructor(
    @InjectRepository(Load)
    private load: Repository<Load>,
    @InjectRepository(Booking)
    private booking: Repository<Booking>,
    @Inject(LoadAddressService)
    private loadAddressService: LoadAddressService,
  ) {}

  async bookLoad(bookLoadDto: BookLoadDto): Promise<boolean> {
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
    const result = await this.load.update(
      { id: load.id },
      { assigneeId: booking.createdBy, status: LoadStatus.BOOKED },
    );
    if (result) {
      await this.booking.update(
        { loadId: load.id, id: booking.id },
        { confirmation: true },
      );
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
    },
    relations?: Array<
      'sourceAddress' | 'destinationAddress' | 'lineItems' | 'bookings'
    >,
  ): Promise<Load[]> {
    const idFilter = filterBy.ids ? { id: In(fillNull(filterBy.ids)) } : {};
    const createdByFilter = filterBy.createdBy
      ? { createdBy: filterBy.createdBy }
      : {};
    return await this.load.find({
      take,
      skip,
      where: [
        {
          deleted: false,
          ...idFilter,
          ...createdByFilter,
        },
      ],
      relations,
    });
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
      lineItem.sku = i.sku;
      lineItem.weight = i.weight;
      lineItem.weightUnit = i.weightUnit;
      lineItem.additionalMeasureUOM = i.additionalMeasureUOM;
      lineItem.additionalMeasureValue = i.additionalMeasureValue;
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
    loadDao.priceRate = loadDto.priceRate;
    loadDao.totalPrice = loadDto.totalPrice;
    loadDao.vehicleRequirement = loadDto.vehicleRequirement;
    loadDao.status = LoadStatus.DRAFT;

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
