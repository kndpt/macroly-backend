import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aliment } from './type/entity/aliment.entity';
import { Composition } from './type/entity/composition.entity';
import { Constituant } from './type/entity/constituant.entity';
import { AlimentModule } from './api/aliment/aliment.module';
import { CompositionModule } from './api/composition/composition.module';
import { AlimentGroup } from './type/entity/aliment-group.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: '@Zerty11+',
      database: 'macroly-ressources',
      entities: [Aliment, Composition, Constituant, AlimentGroup],
      synchronize: false,
    }),
    AlimentModule,
    CompositionModule,
  ],
})
export class AppModule {}
