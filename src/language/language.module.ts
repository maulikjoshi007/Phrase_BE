import { Module } from '@nestjs/common';
import { LanguageService } from './language.service';
import { LanguageController } from './language.controller';
import { KnexModule } from 'src/knex/knex.module';

@Module({
  imports:[KnexModule],
  providers: [LanguageService],
  controllers: [LanguageController]
})
export class LanguageModule {}
