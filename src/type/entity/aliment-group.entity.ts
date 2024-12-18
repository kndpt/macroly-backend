import {
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Aliment } from './aliment.entity';

@Entity('aliment_group')
export class AlimentGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn()
  alim_grp_code: number;

  @PrimaryColumn()
  alim_ssgrp_code: number;

  @PrimaryColumn()
  alim_ssssgrp_code: number;

  @Column({ nullable: true })
  alim_grp_nom_fr: string;

  @Column({ nullable: true })
  alim_grp_nom_eng: string;

  @Column({ nullable: true })
  alim_ssgrp_nom_fr: string;

  @Column({ nullable: true })
  alim_ssgrp_nom_eng: string;

  @Column({ nullable: true })
  alim_ssssgrp_nom_fr: string;

  @Column({ nullable: true })
  alim_ssssgrp_nom_eng: string;

  @OneToMany(() => Aliment, (aliment) => aliment.alimentGroup)
  aliments: Aliment[];
}
