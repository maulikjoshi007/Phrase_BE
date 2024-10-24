import { Module } from '@nestjs/common';
import { Knex } from 'knex';  // Importing Knex for type support
import * as knex from 'knex'; // Explicitly importing knex for connection configuration

@Module({
  providers: [
    {
      /**
       * Provider for Knex Connection
       * The factory function sets up a Knex connection to the PostgreSQL database.
       * @returns A promise that resolves to a Knex instance with PostgreSQL as the client.
       */
      provide: 'KnexConnection',
      useFactory: async (): Promise<Knex> => {
        // Setting up Knex configuration for PostgreSQL using environment variables
        return knex({
          client: 'pg', // PostgreSQL is used as the database client
          connection: {
            host: process.env.DB_HOST || 'localhost',      // Database host from env or default 'localhost'
            user: process.env.DB_USER || 'maulik',         // Database user from env or default 'maulik'
            password: process.env.DB_PASSWORD || 'admin',  // Database password from env or default 'admin'
            database: process.env.DB_NAME || 'postgres',   // Database name from env or default 'postgres'
          },
        });
      },
    },
  ],
  /**
   * Exporting 'KnexConnection' to make it available for other modules
   * that require database interactions.
   */
  exports: ['KnexConnection'],
})
export class KnexModule {}
