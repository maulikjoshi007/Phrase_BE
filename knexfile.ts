import type { Knex } from 'knex'; // Importing Knex type for configuration typing
import { config as dotenvConfig } from 'dotenv'; // Importing dotenv to load environment variables

// Load environment variables from a .env file
dotenvConfig();  

// Knex configuration object for different environments
const config: { [key: string]: Knex.Config } = {
  
  // Configuration for the development environment
  development: {
    client: 'pg', // PostgreSQL is used as the database client
    connection: {
      host: process.env.DB_HOST || 'localhost',       // Database host from env or default 'localhost'
      user: process.env.DB_USER || 'maulik',          // Database user from env or default 'maulik'
      password: process.env.DB_PASSWORD || 'admin',   // Database password from env or default 'admin'
      database: process.env.DB_NAME || 'postgres',    // Database name from env or default 'postgres'
      charset: 'utf8mb4',                             // Character set to handle emojis or special characters
      dateStrings: true                               // Ensure dates are returned as strings (instead of JavaScript Date objects)
    },
    migrations: {
      directory: './src/database/migrations',         // Directory where migration files are stored in development
      tableName: 'knex_migrations',                   // Table name to track migrations applied to the database
      extension: 'ts',                                // Use TypeScript for migrations
    },
    seeds: {
      directory: './src/database/seeds',              // Directory where seed files are stored in development
    },
  },

  // Configuration for the production environment
  production: {
    client: 'pg',                                     // PostgreSQL is used as the database client
    connection: process.env.DATABASE_URL,             // Production DB connection string from environment variable
    migrations: {
      directory: './dist/migrations',                 // Directory where migration files are stored in production (after compilation)
      tableName: 'knex_migrations',                   // Table name to track migrations applied to the database
    },
    seeds: {
      directory: './dist/seeds',                      // Directory where seed files are stored in production (after compilation)
    },
  },
};

// Exporting the configuration object for use by Knex
module.exports = config;
