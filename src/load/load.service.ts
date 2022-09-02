import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { sendError } from '../common/error.service';
import { fillNull } from '../common/utils/repository';
import { In, Repository } from 'typeorm';
import { Load } from './entities/load.entity';
import { LoadDto } from './dto/load.dto';
import { LoadAddressService } from './load-address.service';
import { LoadStatus } from './constant';
import { LineItem } from './entities/line-item.entity';

@Injectable()
export class LoadService {
  constructor(
    @InjectRepository(Load)
    private load: Repository<Load>,
    @Inject(LoadAddressService)
    private loadAddressService: LoadAddressService,
  ) {}

  async getLoads(
    take: number,
    skip: number,
    filterBy: {
      ids?: string[];
      createdBy?: string;
    },
    relations?: Array<'sourceAddress' | 'destinationAddress' | 'lineItems'>,
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

    loadDao.destinationAddressId = (
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
