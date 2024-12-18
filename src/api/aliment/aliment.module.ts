import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlimentController } from './aliment.controller';
import { Aliment } from '../../type/entity/aliment.entity';
import { AlimentService } from './aliment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Aliment])],
  providers: [AlimentService],
  controllers: [AlimentController],
  exports: [AlimentService],
})
export class AlimentModule {}
