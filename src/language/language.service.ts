import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';

@Injectable()
export class LanguageService {
  constructor(@Inject('KnexConnection') private readonly knex: Knex) {}

  /**
   * GET ALL LANGUAGES
   * Fetches all languages from the database without sorting or filtering.
   * 
   * @returns A list of all languages where 'is_deleted' is false
   */
  async getAllLanguages() {
    return this.knex('languages')
      .select('*')
      .where('is_deleted', false);
  }
}
