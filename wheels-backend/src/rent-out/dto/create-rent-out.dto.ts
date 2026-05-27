import { IsString, IsOptional } from 'class-validator';

export class CreateRentOutDto {
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsString()
  carType: string;

  @IsString()
  model: string;

  @IsOptional()
  @IsString()
  year?: string;

  @IsOptional()
  @IsString()
  mileage?: string;

  @IsOptional()
  @IsString()
  comment?: string;
}
