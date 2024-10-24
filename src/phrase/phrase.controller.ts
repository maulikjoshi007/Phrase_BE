import { BadRequestException, Controller, Get, HttpException, Param, Query, Res } from '@nestjs/common';
import { PhraseService } from './phrase.service';
import { isUUID } from 'class-validator';

@Controller('phrase')
export class PhraseController {
  constructor(private readonly phraseService: PhraseService) {}

  /**
   * GET ALL PHRASES
   * Fetches all phrases from the database with pagination and sorting
   * 
   * @param page - The current page for pagination (default is 1)
   * @param limit - The number of records per page (default is 10)
   * @param sort - The column by which results will be sorted (default is 'created_at')
   * @param order - The order of sorting (asc/desc)
   * @returns An object containing the list of phrases
   */
  @Get('get-all-phrase')
  async getAllPhrases(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sort') sort: string = 'created_at',
    @Query('order') order?: string,
  ) {
    return this.phraseService.getAllPhrases(page, limit, sort, order);
  }

  /**
   * SEARCH PHRASES
   * Searches for phrases containing the provided query string with optional pagination and sorting
   * 
   * @param query - The phrase text to search for
   * @param page - The page number for pagination (default: 1)
   * @param limit - The number of items per page (default: 10)
   * @param sort - Optional sorting parameter (default: 'created_at')
   * @param order - Optional sorting order (default: 'asc')
   * @returns An object containing the search results, pagination, and sorting information
   */
  @Get('/search')
  async searchPhrases(
    @Query('query') query: string,
    @Query('page') page: number = 1, // Default to page 1
    @Query('limit') limit: number = 10, // Default to 10 items per page
    @Query('sort') sort: string = 'created_at', // Default sorting by 'created_at'
    @Query('order') order: string = 'asc', // Default order is ascending
  ) {
    try {
      const phrases = await this.phraseService.searchPhrases(query, page, limit, sort, order);

      return {
        data: phrases.data, // The actual phrases
        totalRows: phrases.totalRows, // Total rows matching the query
        currentPage: phrases.currentPage, // Current page number
        totalPages: phrases.totalPages, // Total pages calculated based on limit
        statusCode: 200,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: 500,
          message: 'Error searching phrases',
        },
        500,
      );
    }
  }


  /**
   * GET PHRASE BY ID
   * Fetches a single phrase by its UUID
   * 
   * @param id - The UUID of the phrase
   * @returns The phrase object or throws an error if UUID is invalid
   */
  @Get('/:id')
  async getPhraseById(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    return await this.phraseService.getPhraseById(id);
  }

  /**
   * GET TRANSLATION OF A PHRASE
   * Fetches the translation of a specific phrase in the specified language
   * 
   * @param id - The UUID of the phrase
   * @param language - The language code to get the translation for
   * @returns The translation of the phrase in the specified language
   */
  @Get(':id/:language')
  async getTranslation(@Param('id') id: string, @Param('language') language: string) {
    return this.phraseService.getTranslation(id, language);
  }
}
