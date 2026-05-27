import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
export declare class CarsController {
    private carsService;
    constructor(carsService: CarsService);
    findAll(): Promise<import("./entities/car.entity").Car[]>;
    create(dto: CreateCarDto, files: any[]): Promise<import("./entities/car.entity").Car>;
    remove(id: number): Promise<void>;
}
