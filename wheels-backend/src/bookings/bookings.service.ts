import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepo: Repository<Booking>,
    private events: EventEmitter2,
  ) {}

  findAll(): Promise<Booking[]> {
    return this.bookingsRepo.find({ order: { createdAt: 'DESC' } });
  }

  async create(dto: CreateBookingDto): Promise<Booking> {
    const booking = await this.bookingsRepo.save(
      this.bookingsRepo.create({ ...dto, status: 'new' }),
    );
    this.events.emit('booking.created', booking);
    return booking;
  }

  async updateStatus(id: string, dto: UpdateStatusDto): Promise<Booking> {
    await this.bookingsRepo.update(id, { status: dto.status });
    return this.bookingsRepo.findOneByOrFail({ id });
  }

  async remove(id: string): Promise<void> {
    await this.bookingsRepo.delete(id);
  }
}
