import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  carName: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  dateStart: string;

  @Column({ nullable: true })
  dateEnd: string;

  @Column({ default: 'no' })
  delivery: string;

  @Column({ nullable: true, type: 'text' })
  comment: string;

  @Column({ default: 'new' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}
