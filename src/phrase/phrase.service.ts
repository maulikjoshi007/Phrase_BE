import { Inject, Injectable, HttpStatus, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { Knex } from 'knex';

@Injectable()
export class PhraseService {
  constructor(@Inject('KnexConnection') private readonly knex: Knex) {}

  /**
   * GET ALL PHRASES
   * Fetches all phrases with pagination, sorting, and optional status filtering.
   * 
   * @param page - The current page for pagination
   * @param limit - The number of records per page
   * @param sort - The column to sort by
   * @param order - The sort order (asc/desc)
   * @param status - Optional filter for the status of phrases
   * @returns An object containing data, pagination info, and the status code
   */
  async getAllPhrases(page: number, limit: number, sort: string, order: string, status?: string) {
    try {
      // Default values for sorting and order
      const validSortColumns = ['created_at', 'phrase', 'updated_at']; // Define valid columns for sorting
      const validOrders = ['asc', 'desc']; // Define valid sorting directions

      // Validate the sort column, if invalid, default to 'created_at'
      const sortBy = validSortColumns.includes(sort) ? sort : 'created_at';

      // Validate the order direction, if invalid, default to 'asc'
      const sortOrder = validOrders.includes(order) ? order : 'asc';

      // Query for the total number of rows (with optional status filter)
      const totalRowsQuery = this.knex('phrases')
        .count('* as count')
        .where('is_deleted', false);

      // Apply status filter if provided
      if (status) {
        totalRowsQuery.andWhere('status', status);
      }

      const totalRowsResult = await totalRowsQuery;
      const totalRows: any = totalRowsResult[0].count; // Retrieve the count from the result

      // Query for the paginated data with sorting and optional status filter
      const dataQuery = this.knex('phrases')
        .select('*')
        .where('is_deleted', false)
        .orderBy(sortBy, sortOrder) // Apply validated sorting column and order
        .limit(limit)
        .offset((page - 1) * limit); // Pagination offset

      // Apply status filter to paginated query if provided
      if (status) {
        dataQuery.andWhere('status', status);
      }

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
   * Searches for phrases that match the query string, with optional pagination, sorting, and status filtering.
   * 
   * @param query - The search string for the phrase
   * @param page - The page number for pagination (default: 1)
   * @param limit - The number of items per page (default: 10)
   * @param sort - The column to sort by (default: created_at)
   * @param order - The order of sorting (default: asc)
   * @param status - Optional filter for the status of phrases
   * @returns An object containing the search results, pagination info, and any relevant metadata or error message
   */

  async searchPhrases(query: string, page: number, limit: number, sort: string, order: string, status?: string) {
    try {
      // Default values for sorting and order
      const validSortColumns = ['created_at', 'phrase', 'updated_at']; // Define valid columns for sorting
      const validOrders = ['asc', 'desc']; // Define valid sorting directions
  
      // Validate the sort column, if invalid, default to 'created_at'
      const sortBy = validSortColumns.includes(sort) ? sort : 'created_at';
  
      // Validate the order direction, if invalid, default to 'asc'
      const sortOrder = validOrders.includes(order) ? order : 'asc';
  
      // Query for the total number of rows that match the search query and status filter
      const totalRowsQuery = this.knex('phrases')
        .count('* as count')
        .where('phrase', 'ILIKE', `%${query}%`)
        .andWhere('is_deleted', false);
  
      // Apply status filter if provided
      if (status) {
        totalRowsQuery.andWhere('status', status);
      }
  
      const totalRowsResult = await totalRowsQuery;
      const totalRows: any = totalRowsResult[0].count; // Get total row count
  
      // Query for the paginated data with sorting, search, and status filter
      const dataQuery = this.knex('phrases')
        .select('*')
        .where('phrase', 'ILIKE', `%${query}%`)
        .andWhere('is_deleted', false)
        .orderBy(sortBy, sortOrder) // Use validated sorting column and order
        .limit(limit)
        .offset((page - 1) * limit);
  
      // Apply status filter to paginated query if provided
      if (status) {
        dataQuery.andWhere('status', status);
      }
  
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
