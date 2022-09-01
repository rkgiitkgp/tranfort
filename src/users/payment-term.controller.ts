import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TenantAuth } from '../auth/decorator/auth.decorator';
import { PaymentTermDto } from './dto/payment-term.dto';
import { PaymentTerm } from './entities/payment-term.entity';
import { PaymentTermService } from './payment-term.service';

@ApiTags('Payment Term')
@Controller('payment-term')
// @TenantAuth()
@ApiBearerAuth()
export class PaymentTermController {
  constructor(
    @Inject(PaymentTermService)
    private paymentTermService: PaymentTermService,
  ) {}
  @Get()
  async getAllPaymentTerm(): Promise<PaymentTerm[]> {
    const result = await this.paymentTermService.getPaymentTerm(
      100,
      0,

      {},
    );
    return result;
  }

  @Get('/:id')
  async getPaymentTerm(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<PaymentTerm[]> {
    const result = await this.paymentTermService.getPaymentTerm(
      100,
      0,

      {
        ids: [id],
      },
    );
    if (result.length == 0) throw new NotFoundException();
    return result;
  }

  @Post()
  async createPaymentTerm(
    @Body() paymentTermDto: PaymentTermDto,
  ): Promise<PaymentTerm> {
    return await this.paymentTermService.savePaymentTerm(paymentTermDto);
  }

  @Put('/:id')
  async savePaymentTerm(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() paymentTermDto: PaymentTermDto,
  ): Promise<PaymentTerm> {
    return await this.paymentTermService.savePaymentTerm(paymentTermDto, id);
  }

  @Delete('/:id')
  async deletePaymentTerm(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.paymentTermService.deletePaymentTerm([id]);
  }
}
