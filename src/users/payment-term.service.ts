import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { sendError } from '../common/error.service';
import { fillNull } from '../common/utils/repository';
import { In, Repository } from 'typeorm';
import { PaymentTermDto } from './dto/payment-term.dto';
import { PaymentTerm } from './entities/payment-term.entity';

@Injectable()
export class PaymentTermService {
  constructor(
    @InjectRepository(PaymentTerm)
    private paymentTerm: Repository<PaymentTerm>,
  ) {}

  async getPaymentTerm(
    take: number,
    skip: number,
    filterBy: {
      ids?: string[];
    },
  ): Promise<PaymentTerm[]> {
    const idFilter = filterBy.ids ? { id: In(fillNull(filterBy.ids)) } : {};

    return await this.paymentTerm.find({
      take,
      skip,
      where: [
        {
          deleted: false,
          ...idFilter,
        },
      ],
    });
  }

  async savePaymentTerm(
    paymentTermDto: PaymentTermDto,
    id?: string,
  ): Promise<PaymentTerm> {
    let paymentTermDao = new PaymentTerm();
    if (id) {
      const paymentTerm = await this.getPaymentTerm(1, 0, {
        ids: [id],
      });
      if (paymentTerm.length == 0) throw new NotFoundException();
      paymentTermDao = paymentTerm[0];
    }
    paymentTermDao.name = paymentTermDto.name;
    paymentTermDao.dueDate = paymentTermDto.dueDate;
    paymentTermDao.type = paymentTermDto.type;

    try {
      return await this.paymentTerm.save(paymentTermDao);
    } catch (error) {
      sendError(error, 'payment term');
    }
  }

  async deletePaymentTerm(ids: string[]) {
    return await this.paymentTerm.update(
      { id: In(fillNull(ids)) },
      {
        deleted: true,
        name: () => `CONCAT(name,id)`,
      },
    );
  }
}
