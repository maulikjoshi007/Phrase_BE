import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Enable the 'uuid-ossp' extension if it's not already enabled
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

  // Create 'languages' table
  await knex.schema.createTable('languages', (table) => {
    table.uuid('uuid').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('language_code', 10).notNullable().unique(); // e.g., 'en', 'fr', 'es'
    table.string('language_name').notNullable(); // e.g., 'English', 'French', 'Spanish'
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.string('created_by');
    table.string('updated_by').nullable();
    table.boolean('is_deleted').defaultTo(false);
  });

  // Create 'phrases' table
  await knex.schema.createTable('phrases', (table) => {
    table.uuid('uuid').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.text('phrase').notNullable();
    table.enu('status', ['active', 'pending', 'spam', 'deleted']).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.boolean('is_deleted').defaultTo(false);
    table.string('created_by');
    table.string('updated_by').nullable();
  });

  // Create 'translations' table
  await knex.schema.createTable('translations', (table) => {
    table.uuid('uuid').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('phrase_uuid').references('uuid').inTable('phrases').onDelete('CASCADE');
    table.string('language_code', 10).notNullable();
    table.text('translation').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.string('created_by');
    table.string('updated_by').nullable();
    table.boolean('is_deleted').defaultTo(false);

    // Add foreign key constraint for language_code after creating the table
    table.foreign('language_code').references('language_code').inTable('languages').onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  // Drop 'translations' table first due to foreign key constraint
  await knex.schema.dropTableIfExists('translations');
  // Drop 'phrases' table
  await knex.schema.dropTableIfExists('phrases');
  // Drop 'languages' table
  await knex.schema.dropTableIfExists('languages');
}
