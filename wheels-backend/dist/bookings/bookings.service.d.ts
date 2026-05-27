import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
export declare class BookingsService {
    private bookingsRepo;
    private events;
    constructor(bookingsRepo: Repository<Booking>, events: EventEmitter2);
    findAll(): Promise<Booking[]>;
    create(dto: CreateBookingDto): Promise<Booking>;
    updateStatus(id: string, dto: UpdateStatusDto): Promise<Booking>;
    remove(id: string): Promise<void>;
}
