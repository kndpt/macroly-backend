import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Aliment } from './aliment.entity';
import { Constituant } from './constituant.entity';

@Entity('composition')
export class Composition {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Aliment, (aliment) => aliment.compositions)
  @JoinColumn({ name: 'alim_code' })
  aliment: Aliment;

  @ManyToOne(() => Constituant, (constituant) => constituant.compositions)
  @JoinColumn({ name: 'const_code' })
  constituant: Constituant;

  @Column({ type: 'float', nullable: true })
  teneur: number;

  @Column({ type: 'float', nullable: true })
  min: number;

  @Column({ type: 'float', nullable: true })
  max: number;

  @Column({ nullable: true })
  code_confiance: string;

  @Column({ nullable: true })
  source_code: string;
}
