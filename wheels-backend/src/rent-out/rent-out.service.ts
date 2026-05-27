import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RentOutRequest } from './entities/rent-out-request.entity';
import { CreateRentOutDto } from './dto/create-rent-out.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class RentOutService {
  constructor(
    @InjectRepository(RentOutRequest)
    private rentOutRepo: Repository<RentOutRequest>,
    private events: EventEmitter2,
  ) {}

  findAll(): Promise<RentOutRequest[]> {
    return this.rentOutRepo.find({ order: { createdAt: 'DESC' } });
  }

  async create(dto: CreateRentOutDto): Promise<RentOutRequest> {
    const req = await this.rentOutRepo.save(
      this.rentOutRepo.create({ ...dto, status: 'new' }),
    );
    this.events.emit('rentout.created', req);
    return req;
  }

  async updateStatus(id: string, dto: UpdateStatusDto): Promise<RentOutRequest> {
    await this.rentOutRepo.update(id, { status: dto.status });
    return this.rentOutRepo.findOneByOrFail({ id });
  }

  async remove(id: string): Promise<void> {
    await this.rentOutRepo.delete(id);
  }
}
