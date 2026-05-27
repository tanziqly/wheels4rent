import {
  Controller, Get, Post, Delete,
  Param, Body, UseGuards, ParseIntPipe, HttpCode,
  UseInterceptors, UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

const uploadStorage = diskStorage({
  destination: (_req, _file, cb) => {
    const dir = './uploads/cars';
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${unique}${extname(file.originalname)}`);
  },
});

const imageFilter = (_req: any, file: any, cb: any) => {
  if (file.mimetype.match(/^image\/(jpeg|jpg|png|gif|webp|avif)$/)) {
    cb(null, true);
  } else {
    cb(new Error('Разрешены только файлы изображений'), false);
  }
};

@Controller('cars')
export class CarsController {
  constructor(private carsService: CarsService) {}

  @Get()
  findAll() {
    return this.carsService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor('images', 10, { storage: uploadStorage, fileFilter: imageFilter }),
  )
  create(
    @Body() dto: CreateCarDto,
    @UploadedFiles() files: any[],
  ) {
    const images = (files ?? []).map((f: any) => `/uploads/cars/${f.filename}`);
    return this.carsService.create(dto, images);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.carsService.remove(id);
  }
}
