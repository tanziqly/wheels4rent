import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthModule } from './auth/auth.module';
import { CarsModule } from './cars/cars.module';
import { BookingsModule } from './bookings/bookings.module';
import { RentOutModule } from './rent-out/rent-out.module';
import { TelegramModule } from './telegram/telegram.module';
import { Car } from './cars/entities/car.entity';
import { Booking } from './bookings/entities/booking.entity';
import { RentOutRequest } from './rent-out/entities/rent-out-request.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        entities: [Car, Booking, RentOutRequest],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    CarsModule,
    BookingsModule,
    RentOutModule,
    TelegramModule,
  ],
})
export class AppModule {}
