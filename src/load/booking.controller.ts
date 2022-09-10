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
import { BookingService } from './booking.service';
import { BookingDto } from './dto/booking.dto';
import { Booking } from './entities/booking.entity';

@ApiTags('Booking')
@Controller('booking')
@TenantAuth()
@ApiBearerAuth()
export class BookingController {
  constructor(
    @Inject(BookingService)
    private bookingService: BookingService,
  ) {}
  @Get()
  async getAllBooking(): Promise<Booking[]> {
    const result = await this.bookingService.getBookings(100, 0, {}, []);
    return result;
  }

  @Get('/:id')
  async getBookingTerm(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Booking[]> {
    const result = await this.bookingService.getBookings(
      100,
      0,
      {
        ids: [id],
      },
      [],
    );
    if (result.length == 0) throw new NotFoundException();
    return result;
  }

  @Post()
  async createBookingTerm(@Body() bookingDto: BookingDto): Promise<Booking> {
    return await this.bookingService.saveBookings(bookingDto);
  }

  @Put('/:id')
  async saveBookingTerm(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() bookingDto: BookingDto,
  ): Promise<Booking> {
    return await this.bookingService.saveBookings(bookingDto, id);
  }

  @Delete('/:id')
  async deleteBookingTerm(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.bookingService.deleteBooking(id);
  }
}
