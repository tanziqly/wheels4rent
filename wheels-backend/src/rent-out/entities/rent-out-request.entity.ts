import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('rent_out_requests')
export class RentOutRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  carType: string;

  @Column()
  model: string;

  @Column({ nullable: true })
  year: string;

  @Column({ nullable: true })
  mileage: string;

  @Column({ nullable: true, type: 'text' })
  comment: string;

  @Column({ default: 'new' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}
