import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RentOutRequest } from './entities/rent-out-request.entity';
import { CreateRentOutDto } from './dto/create-rent-out.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
export declare class RentOutService {
    private rentOutRepo;
    private events;
    constructor(rentOutRepo: Repository<RentOutRequest>, events: EventEmitter2);
    findAll(): Promise<RentOutRequest[]>;
    create(dto: CreateRentOutDto): Promise<RentOutRequest>;
    updateStatus(id: string, dto: UpdateStatusDto): Promise<RentOutRequest>;
    remove(id: string): Promise<void>;
}
