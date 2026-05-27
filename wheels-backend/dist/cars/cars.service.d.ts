import { OnModuleInit } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Car } from './entities/car.entity';
import { CreateCarDto } from './dto/create-car.dto';
export declare class CarsService implements OnModuleInit {
    private carsRepo;
    private dataSource;
    constructor(carsRepo: Repository<Car>, dataSource: DataSource);
    onModuleInit(): Promise<void>;
    findAll(): Promise<Car[]>;
    create(dto: CreateCarDto, images?: string[]): Promise<Car>;
    remove(id: number): Promise<void>;
}
