import { RentOutService } from './rent-out.service';
import { CreateRentOutDto } from './dto/create-rent-out.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
export declare class RentOutController {
    private rentOutService;
    constructor(rentOutService: RentOutService);
    findAll(): Promise<import("./entities/rent-out-request.entity").RentOutRequest[]>;
    create(dto: CreateRentOutDto): Promise<import("./entities/rent-out-request.entity").RentOutRequest>;
    updateStatus(id: string, dto: UpdateStatusDto): Promise<import("./entities/rent-out-request.entity").RentOutRequest>;
    remove(id: string): Promise<void>;
}
