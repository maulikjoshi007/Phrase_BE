import { Controller, Get, HttpException } from '@nestjs/common';
import { LanguageService } from './language.service';

@Controller('language')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  /**
   * GET LIST OF ALL LANGUAGES
   * API endpoint to retrieve the list of all languages from the database.
   * 
   * @returns A JSON response with the list of languages and HTTP status code 200 if successful.
   * @throws HttpException with status code 500 if there is an error while fetching data.
   */
  @Get('list')
  async getAllLanguages() {
    try {
      const languages = await this.languageService.getAllLanguages();
      return {
        data: languages,
        statusCode: 200,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: 500,
          message: 'Error fetching languages',
        },
        500,
      );
    }
  }
}
