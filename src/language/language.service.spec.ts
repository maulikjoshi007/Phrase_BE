import { Test, TestingModule } from '@nestjs/testing';
import { LanguageService } from './language.service';
import { KnexModule } from '../knex/knex.module';
import { LanguageController } from './language.controller';

describe('LanguageService', () => {
  let service: LanguageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[KnexModule],
      controllers:[LanguageController],
      providers: [LanguageService],
    }).compile();

    service = module.get<LanguageService>(LanguageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
