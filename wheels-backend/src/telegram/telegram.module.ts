import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegramService } from './telegram.service';
import { Booking } from '../bookings/entities/booking.entity';
import { RentOutRequest } from '../rent-out/entities/rent-out-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, RentOutRequest])],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule {}
