import { IsIn } from 'class-validator';

export class UpdateStatusDto {
  @IsIn(['new', 'done'])
  status: 'new' | 'done';
}
