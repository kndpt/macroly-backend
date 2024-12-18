import {
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Composition } from './composition.entity';

@Entity('constituant')
export class Constituant {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn()
  const_code: number;

  @Column()
  const_nom_fr: string;

  @Column()
  const_nom_eng: string;

  @OneToMany(() => Composition, (composition) => composition.constituant)
  compositions: Composition[];
}
