import { forwardRef, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PhraseModule } from './phrase/phrase.module';
import { KnexModule } from './knex/knex.module';
import { LanguageModule } from './language/language.module';


@Module({
  imports: [
     // GLOBAL CONFIGURATION MODULE
     ConfigModule.forRoot({ isGlobal: true }),
    
     forwardRef(() => PhraseModule),
    
     KnexModule,

     forwardRef(() => LanguageModule)
     

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
