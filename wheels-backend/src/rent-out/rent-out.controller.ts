import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, UseGuards, HttpCode,
} from '@nestjs/common';
import { RentOutService } from './rent-out.service';
import { CreateRentOutDto } from './dto/create-rent-out.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('rent-out')
export class RentOutController {
  constructor(private rentOutService: RentOutService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.rentOutService.findAll();
  }

  @Post()
  create(@Body() dto: CreateRentOutDto) {
    return this.rentOutService.create(dto);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.rentOutService.updateStatus(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.rentOutService.remove(id);
  }
}
