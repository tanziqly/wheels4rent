import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
export declare class BookingsController {
    private bookingsService;
    constructor(bookingsService: BookingsService);
    findAll(): Promise<import("./entities/booking.entity").Booking[]>;
    create(dto: CreateBookingDto): Promise<import("./entities/booking.entity").Booking>;
    updateStatus(id: string, dto: UpdateStatusDto): Promise<import("./entities/booking.entity").Booking>;
    remove(id: string): Promise<void>;
}
