import { Inject, Injectable, HttpStatus, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { Knex } from 'knex';

@Injectable()
export class PhraseService {
  constructor(@Inject('KnexConnection') private readonly knex: Knex) {}

  /**
   * GET ALL PHRASES
   * Fetches all phrases with pagination and sorting
   * 
   * @param page - The current page for pagination
   * @param limit - The number of records per page
   * @param sort - The column to sort by
   * @param order - The sort order (asc/desc)
   * @returns An object containing data and the status code
   */
  async getAllPhrases(page: number, limit: number, sort: string, order: string) {
    try {
      // Default values for sorting and order
      const validSortColumns = ['created_at', 'phrase', 'updated_at']; // Define valid columns for sorting
      const validOrders = ['asc', 'desc']; // Define valid sorting directions
  
      // Validate the sort column, if invalid, default to 'created_at'
      const sortBy = validSortColumns.includes(sort) ? sort : 'created_at';
  
      // Validate the order direction, if invalid, default to 'asc'
      const sortOrder = validOrders.includes(order) ? order : 'asc';
  
      // Query for the total number of rows (without pagination)
      const totalRowsQuery = this.knex('phrases')
        .count('* as count')
        .where('is_deleted', false);
  
      const totalRowsResult = await totalRowsQuery;
      const totalRows:any = totalRowsResult[0].count; // Retrieve the count from the result
  
      // Query for the paginated data with sorting
      const dataQuery = this.knex('phrases')
        .select('*')
        .where('is_deleted', false)
        .orderBy(sortBy, sortOrder) // Apply validated sorting column and order
        .limit(limit)
        .offset((page - 1) * limit); // Pagination offset
  
      const data = await dataQuery;
  
      return {
        data,
        totalRows, // Include total number of rows in the response
        currentPage: page, // Include current page number
        totalPages: Math.ceil(totalRows / limit), // Calculate total pages
        statusCode: HttpStatus.OK, // 200 OK
      };
    } catch (error) {
      return {
        data: null,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR, // 500 Internal Server Error
        message: error.message,
      };
    }
  }
  

  /**
   * GET PHRASE BY ID
   * Fetches a single phrase by its UUID
   * 
   * @param id - The UUID of the phrase
   * @returns An object containing data, or error if not found
   */
  async getPhraseById(id: string) {
    try {
      const data = await this.knex('phrases')
        .select('*')
        .where('uuid', id)
        .andWhere('is_deleted', false)
        .first();

      if (!data) {
        return {
          data: null,
          statusCode: HttpStatus.NOT_FOUND, // 404 Not Found
          message: 'Phrase not found',
        };
      }

      return {
        data,
        statusCode: HttpStatus.OK, // 200 OK
      };
    } catch (error) {
      return {
        data: null,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR, // 500 Internal Server Error
        message: error.message,
      };
    }
  }

  /**
   * GET TRANSLATION
   * Fetches the translation of a phrase for a specific language
   * 
   * @param id - The UUID of the phrase
   * @param language - The language code for the translation
   * @returns The translated phrase or an error if not found
   */
  async getTranslation(id: string, language: string) {
    try {
      const data = await this.knex('translations')
        .select('translation')
        .where('phrase_uuid', id)
        .andWhere('language_code', language)
        .first();

      if (!data) {
        return {
          data: null,
          statusCode: HttpStatus.NOT_FOUND, // 404 Not Found
          message: 'Translation not found',
        };
      }

      return {
        data,
        statusCode: HttpStatus.OK, // 200 OK
      };
    } catch (error) {
      return {
        data: null,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR, // 500 Internal Server Error
        message: error.message,
      };
    }
  }

  /**
   * SEARCH PHRASES
   * Searches for phrases that match the query, with optional sorting
   * 
   * @param query - The search string for the phrase
   * @param sort - The column to sort by (default: created_at)
   * @param order - The order of sorting (default: asc)
   * @returns An object containing the search results or an error message
   */
  async searchPhrases(query: string, page: number, limit: number, sort: string, order: string) {
    try {
      // Default values for sorting and order
      const validSortColumns = ['created_at', 'phrase', 'updated_at']; // Define valid columns for sorting
      const validOrders = ['asc', 'desc']; // Define valid sorting directions
  
      // Validate the sort column, if invalid, default to 'created_at'
      const sortBy = validSortColumns.includes(sort) ? sort : 'created_at';
  
      // Validate the order direction, if invalid, default to 'asc'
      const sortOrder = validOrders.includes(order) ? order : 'asc';
  
      // Query for the total number of rows that match the search query
      const totalRowsQuery = this.knex('phrases')
        .count('* as count')
        .where('phrase', 'ILIKE', `%${query}%`)
        .andWhere('is_deleted', false);
  
      const totalRowsResult = await totalRowsQuery;
      const totalRows: any = totalRowsResult[0].count; // Get total row count
  
      // Query for the paginated data with sorting and search
      const dataQuery = this.knex('phrases')
        .select('*')
        .where('phrase', 'ILIKE', `%${query}%`)
        .andWhere('is_deleted', false)
        .orderBy(sortBy, sortOrder) // Use validated sorting column and order
        .limit(limit)
        .offset((page - 1) * limit);
  
      const data = await dataQuery;
  
      return {
        data,
        totalRows, // Include total number of rows in the response
        currentPage: page, // Include current page number
        totalPages: Math.ceil(totalRows / limit), // Calculate total pages
        statusCode: HttpStatus.OK, // 200 OK
      };
    } catch (error) {
      return {
        data: null,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR, // 500 Internal Server Error
        message: error.message,
      };
    }
  }
  
  
}
