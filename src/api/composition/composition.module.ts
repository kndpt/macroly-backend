import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompositionService } from './composition.service';
import { Composition } from 'src/type/entity/composition.entity';
import { CompositionController } from './composition.controller';
import { AlimentMapper } from 'src/mapper/aliment.mapper';
import { AlimentModule } from '../aliment/aliment.module';
import { AIService } from 'src/service/ai.service';

@Module({
  imports: [TypeOrmModule.forFeature([Composition]), AlimentModule],
  providers: [CompositionService, AlimentMapper, AIService],
  controllers: [CompositionController],
})
export class CompositionModule {}
