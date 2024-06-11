import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Period {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;
}
