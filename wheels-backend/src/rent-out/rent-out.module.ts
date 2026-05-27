import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RentOutController } from './rent-out.controller';
import { RentOutService } from './rent-out.service';
import { RentOutRequest } from './entities/rent-out-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RentOutRequest])],
  controllers: [RentOutController],
  providers: [RentOutService],
})
export class RentOutModule {}
