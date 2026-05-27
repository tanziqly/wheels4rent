import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCarDto {
  @IsString()
  slug: string;

  @IsString()
  name: string;

  @IsString()
  category: string;

  @IsString()
  categorySlug: string;

  @IsString()
  engine: string;

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  seats: number;

  @IsString()
  power: string;

  @IsString()
  transmission: string;

  @IsString()
  drive: string;

  @IsString()
  priceFrom: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  priceNum: number;

  @IsOptional()
  @IsString()
  description?: string;

  // Приходит как строка из multipart, разбираем в сервисе
  @IsOptional()
  @IsString()
  featuresJson?: string;
}
