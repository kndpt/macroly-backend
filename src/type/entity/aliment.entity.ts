import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Composition } from './composition.entity';
import { AlimentGroup } from './aliment-group.entity';

@Entity('aliment')
export class Aliment {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn()
  alim_code: number;

  @Column()
  alim_nom_fr: string;

  @Column()
  alim_nom_eng: string;

  @Column({ default: 0 })
  alim_grp_code: number;

  @Column({ nullable: true })
  alim_ssgrp_code: number;

  @Column({ nullable: true })
  alim_ssssgrp_code: number;

  @OneToMany(() => Composition, (composition) => composition.aliment)
  compositions: Composition[];

  @ManyToOne(() => AlimentGroup, (alimentGroup) => alimentGroup.aliments)
  @JoinColumn([
    { name: 'alim_grp_code', referencedColumnName: 'alim_grp_code' },
    { name: 'alim_ssgrp_code', referencedColumnName: 'alim_ssgrp_code' },
    { name: 'alim_ssssgrp_code', referencedColumnName: 'alim_ssssgrp_code' },
  ])
  alimentGroup: AlimentGroup;
}
