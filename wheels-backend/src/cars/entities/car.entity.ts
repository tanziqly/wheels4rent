import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('cars')
export class Car {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true, default: '' })
  seed: string;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column()
  categorySlug: string;

  @Column()
  engine: string;

  @Column({ default: 4 })
  seats: number;

  @Column()
  power: string;

  @Column({ default: 'АКПП' })
  transmission: string;

  @Column({ default: 'Полный' })
  drive: string;

  @Column()
  priceFrom: string;

  @Column()
  priceNum: number;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ type: 'jsonb', default: [] })
  features: string[];

  @Column({ type: 'jsonb', default: [] })
  extraSeeds: string[];

  // Пути к загруженным файлам, напр. ["/uploads/cars/123.jpg"]
  @Column({ type: 'jsonb', default: [] })
  images: string[];

  @CreateDateColumn()
  createdAt: Date;
}
