import { Test, TestingModule } from '@nestjs/testing';
import { LanguageController } from './language.controller';
import { KnexModule } from '../knex/knex.module';
import { LanguageService } from './language.service';

describe('LanguageController', () => {
  let controller: LanguageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[KnexModule],
      controllers: [LanguageController],
      providers:[LanguageService]
    }).compile();

    controller = module.get<LanguageController>(LanguageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
