import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Car } from './entities/car.entity';
import { CreateCarDto } from './dto/create-car.dto';

@Injectable()
export class CarsService implements OnModuleInit {
  constructor(
    @InjectRepository(Car)
    private carsRepo: Repository<Car>,
    private dataSource: DataSource,
  ) {}

  async onModuleInit() {
    await this.dataSource
      .query(
        `SELECT setval(
          pg_get_serial_sequence('cars', 'id'),
          GREATEST(1000, COALESCE((SELECT MAX(id) FROM cars), 0))
        )`,
      )
      .catch(() => {});
  }

  findAll(): Promise<Car[]> {
    return this.carsRepo.find({ order: { createdAt: 'DESC' } });
  }

  create(dto: CreateCarDto, images: string[] = []): Promise<Car> {
    const features: string[] = dto.featuresJson
      ? JSON.parse(dto.featuresJson)
      : [];
    const { featuresJson: _, ...rest } = dto;
    const car = this.carsRepo.create({ ...rest, images, features, extraSeeds: [], seed: '' });
    return this.carsRepo.save(car);
  }

  async remove(id: number): Promise<void> {
    await this.carsRepo.delete(id);
  }
}
