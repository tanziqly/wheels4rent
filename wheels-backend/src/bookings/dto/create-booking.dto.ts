import { IsString, IsOptional, IsIn } from 'class-validator';

export class CreateBookingDto {
  @IsOptional()
  @IsString()
  carName?: string;

  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  dateStart?: string;

  @IsOptional()
  @IsString()
  dateEnd?: string;

  @IsOptional()
  @IsIn(['yes', 'no'])
  delivery?: string;

  @IsOptional()
  @IsString()
  comment?: string;
}
