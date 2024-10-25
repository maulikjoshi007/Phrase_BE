import { Test, TestingModule } from '@nestjs/testing';
import { PhraseService } from './phrase.service';
import { KnexModule } from '../knex/knex.module';
import { PhraseController } from './phrase.controller';

describe('PhraseService', () => {
  let service: PhraseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[KnexModule],
      controllers:[PhraseController],
      providers: [PhraseService],
    }).compile();

    service = module.get<PhraseService>(PhraseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
