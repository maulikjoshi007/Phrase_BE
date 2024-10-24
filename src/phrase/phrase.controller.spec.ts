import { Test, TestingModule } from '@nestjs/testing';
import { PhraseController } from './phrase.controller';
import { PhraseService } from './phrase.service';
import { BadRequestException } from '@nestjs/common';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { KnexModule } from 'src/knex/knex.module';

describe('PhraseController', () => {
  let app: INestApplication;
  let phraseService = {
    getAllPhrases: jest.fn(),
    getPhraseById: jest.fn(),
    searchPhrases: jest.fn(),
    getTranslation: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports:[KnexModule],
      controllers: [PhraseController],
      providers: [
        {
          provide: PhraseService,
          useValue: phraseService,
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /get-all-phrase', () => {
    it('should return all phrases with pagination and sorting', () => {
      phraseService.getAllPhrases.mockResolvedValue([
        { uuid: '1', phrase: 'Hello', status: 'active' },
      ]);

      return request(app.getHttpServer())
        .get('/phrase/get-all-phrase')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual([{ uuid: '1', phrase: 'Hello', status: 'active' }]);
        });
    });
  });

  describe('GET /search', () => {
    it('should return phrases based on query', async () => {
      const query = 'hello';
      phraseService.searchPhrases.mockResolvedValue([{ uuid: '1', phrase: 'hello', status: 'active' }]);

      return request(app.getHttpServer())
        .get(`/phrase/search?query=${query}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toEqual([{ uuid: '1', phrase: 'hello', status: 'active' }]);
          expect(res.body.statusCode).toEqual(200);
        });
    });

    it('should return 500 if an error occurs', async () => {
      phraseService.searchPhrases.mockRejectedValue(new Error('Internal error'));

      return request(app.getHttpServer())
        .get('/phrase/search?query=hello')
        .expect(500)
        .expect((res) => {
          expect(res.body.message).toEqual('Error searching phrases');
          expect(res.body.statusCode).toEqual(500);
        });
    });
  });

  describe('GET /:id', () => {
    it('should return a phrase by id', async () => {
      const id = '1';
      phraseService.getPhraseById.mockResolvedValue({ uuid: id, phrase: 'hello' });

      return request(app.getHttpServer())
        .get(`/phrase/${id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual({ uuid: '1', phrase: 'hello' });
        });
    });

    it('should return 400 for an invalid UUID', async () => {
      const invalidId = 'invalid-uuid';

      return request(app.getHttpServer())
        .get(`/phrase/${invalidId}`)
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toEqual('Invalid UUID');
          expect(res.body.statusCode).toEqual(400);
        });
    });
  });

  describe('GET /:id/:language', () => {
    it('should return translation of a phrase', async () => {
      const id = '1';
      const language = 'en';
      phraseService.getTranslation.mockResolvedValue({ translation: 'hello' });

      return request(app.getHttpServer())
        .get(`/phrase/${id}/${language}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual({ translation: 'hello' });
        });
    });
  });
});

