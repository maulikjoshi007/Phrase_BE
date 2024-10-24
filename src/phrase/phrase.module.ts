import { Module } from '@nestjs/common';
import { PhraseController } from './phrase.controller';
import { PhraseService } from './phrase.service';
import { KnexModule } from '../knex/knex.module';

@Module({
  imports:[KnexModule],
  controllers: [PhraseController],
  providers: [PhraseService]
})
export class PhraseModule {}
