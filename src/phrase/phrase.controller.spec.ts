import { Test, TestingModule } from '@nestjs/testing'; // Importing testing utilities from NestJS
import { PhraseController } from './phrase.controller'; // Importing the PhraseController
import { PhraseService } from './phrase.service'; // Importing the PhraseService
import * as request from 'supertest'; // Importing Supertest for HTTP assertions
import { INestApplication, BadRequestException } from '@nestjs/common'; // Importing common decorators and exceptions
import { KnexModule } from '../knex/knex.module'; // Importing the Knex module for database access

describe('PhraseController', () => {
  let app: INestApplication; // Variable to hold the NestJS application instance
  // Mock object for the PhraseService with jest mock functions
  let phraseService = {
    getAllPhrases: jest.fn(), // Mock function for getting all phrases
    getPhraseById: jest.fn(), // Mock function for getting a phrase by ID
    searchPhrases: jest.fn(), // Mock function for searching phrases
    getTranslation: jest.fn(), // Mock function for getting phrase translations
  };

  // Set up the testing module before all tests run
  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [KnexModule], // Importing KnexModule for testing
      controllers: [PhraseController], // Registering PhraseController
      providers: [
        {
          provide: PhraseService, // Providing the mocked PhraseService
          useValue: phraseService,
        },
      ],
    }).compile(); // Compiling the testing module

    app = moduleRef.createNestApplication(); // Creating an instance of the Nest application
    await app.init(); // Initializing the application
  });

  // Closing the application after all tests are done
  afterAll(async () => {
    await app.close();
  });

  describe('GET /get-all-phrase', () => {
    it('should return all phrases with pagination and sorting', () => {
      // Mocking the return value for getAllPhrases
      phraseService.getAllPhrases.mockResolvedValue([
        { uuid: '132456uu789', phrase: 'How Are you?', status: 'ACTIVE' },
      ]);

      // Sending a GET request to the endpoint and checking the response
      return request(app.getHttpServer())
        .get('/phrase/get-all-phrase')
        .expect(200) // Expecting a 200 OK response
        .expect((res) => {
          expect(res.body).toEqual([{ uuid: '132456uu789', phrase: 'How Are you?', status: 'ACTIVE' }]);
        });
    });
  });

  describe('GET /search', () => {
    it('should return phrases based on query', async () => {
      const query = 'How ar'; // Sample search query
      const expectedResponse = {
        data: [{ uuid: '132456uu789', phrase: 'How Are you?', status: 'ACTIVE' }],
        totalRows: 1,
        currentPage: 1,
        totalPages: 1,
        statusCode: 200,
      };

      // Mocking the return value for searchPhrases
      phraseService.searchPhrases.mockResolvedValue(expectedResponse);

      // Sending a GET request with the search query and checking the response
      return request(app.getHttpServer())
        .get(`/phrase/search?query=${query}`)
        .expect(200) // Expecting a 200 OK response
        .expect((res) => {
          expect(res.body).toEqual(expectedResponse); // Checking the response body
        });
    });

    it('should return 500 if an error occurs', async () => {
      // Mocking an error for searchPhrases
      phraseService.searchPhrases.mockRejectedValue(new Error('Internal error'));

      // Sending a GET request and expecting a 500 Internal Server Error response
      return request(app.getHttpServer())
        .get('/phrase/search?query=how')
        .expect(500) // Expecting a 500 response
        .expect((res) => {
          expect(res.body.message).toEqual('Error searching phrases'); // Checking error message
          expect(res.body.statusCode).toEqual(500); // Checking status code
        });
    });
  });

  describe('GET /:id', () => {
    it('should return a phrase by id', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440000'; // Valid UUID for testing
      phraseService.getPhraseById.mockResolvedValue({ uuid: id, phrase: 'How Are you?' }); // Mocking the return value

      // Sending a GET request for the phrase ID and checking the response
      return request(app.getHttpServer())
        .get(`/phrase/${id}`)
        .expect(200) // Expecting a 200 OK response
        .expect((res) => {
          expect(res.body).toEqual({ uuid: id, phrase: 'How Are you?' }); // Checking the response body
        });
    });

    it('should return 400 for an invalid UUID', async () => {
      const invalidId = 'invalid-uuid'; // Invalid UUID for testing

      // Sending a GET request with the invalid UUID and expecting a 400 Bad Request response
      return request(app.getHttpServer())
        .get(`/phrase/${invalidId}`)
        .expect(400) // Expecting a 400 response
        .expect((res) => {
          expect(res.body.message).toEqual('Invalid UUID'); // Checking error message
          expect(res.body.statusCode).toEqual(400); // Checking status code
        });
    });
  });

  describe('GET /:id/:language', () => {
    it('should return translation of a phrase', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440000'; // Valid UUID for testing
      const language = 'en'; // Language code for translation
      phraseService.getTranslation.mockResolvedValue({ translation: 'How Are you?' }); // Mocking the return value

      // Sending a GET request for the translation and checking the response
      return request(app.getHttpServer())
        .get(`/phrase/${id}/${language}`)
        .expect(200) // Expecting a 200 OK response
        .expect((res) => {
          expect(res.body).toEqual({ translation: 'How Are you?' }); // Checking the response body
        });
    });
  });
});
