import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries to avoid duplicates
  await knex('translations').del();
  await knex('phrases').del();
  await knex('languages').del();

  // Insert languages
  const languages = await knex('languages').insert([
    {
      uuid: knex.raw('uuid_generate_v4()'),
      language_code: 'en',
      language_name: 'English',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
      created_by: 'system',
      is_deleted: false,
    },
    {
      uuid: knex.raw('uuid_generate_v4()'),
      language_code: 'fr',
      language_name: 'French',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
      created_by: 'system',
      is_deleted: false,
    },
    {
      uuid: knex.raw('uuid_generate_v4()'),
      language_code: 'es',
      language_name: 'Spanish',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
      created_by: 'system',
      is_deleted: false,
    },
    {
      uuid: knex.raw('uuid_generate_v4()'),
      language_code: 'de',
      language_name: 'German',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
      created_by: 'system',
      is_deleted: false,
    },
    {
      uuid: knex.raw('uuid_generate_v4()'),
      language_code: 'it',
      language_name: 'Italian',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
      created_by: 'system',
      is_deleted: false,
    },
  ]).returning('*');

  // Insert phrases
  const phrases = await knex('phrases').insert([
    {
      uuid: knex.raw('uuid_generate_v4()'),
      phrase: 'Hi, I’m a phrase',
      status: 'active',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
      is_deleted: false,
      created_by: 'system',
    },
    {
      uuid: knex.raw('uuid_generate_v4()'),
      phrase: 'How are you?',
      status: 'active',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
      is_deleted: false,
      created_by: 'system',
    },
    {
      uuid: knex.raw('uuid_generate_v4()'),
      phrase: 'Good morning!',
      status: 'active',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
      is_deleted: false,
      created_by: 'system',
    },
    {
      uuid: knex.raw('uuid_generate_v4()'),
      phrase: 'What is your name?',
      status: 'active',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
      is_deleted: false,
      created_by: 'system',
    },
    {
      uuid: knex.raw('uuid_generate_v4()'),
      phrase: 'Have a nice day!',
      status: 'active',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
      is_deleted: false,
      created_by: 'system',
    },
  ]).returning('*');

  // Insert translations
  const translations = [
    {
      phrase_uuid: phrases[0].uuid,
      language_code: languages[0].language_code,
      translation: 'Salut, je suis une phrase', // French
    },
    {
      phrase_uuid: phrases[0].uuid,
      language_code: languages[1].language_code,
      translation: 'Hola, soy una frase', // Spanish
    },
    {
      phrase_uuid: phrases[1].uuid,
      language_code: languages[1].language_code,
      translation: 'Comment ça va?', // French
    },
    {
      phrase_uuid: phrases[1].uuid,
      language_code: languages[0].language_code,
      translation: '¿Cómo estás?', // Spanish
    },
    {
      phrase_uuid: phrases[2].uuid,
      language_code: languages[2].language_code,
      translation: 'Guten Morgen!', // German
    },
    {
      phrase_uuid: phrases[3].uuid,
      language_code: languages[3].language_code,
      translation: 'Wie heißt du?', // German
    },
    {
      phrase_uuid: phrases[4].uuid,
      language_code: languages[4].language_code,
      translation: 'Buona giornata!', // Italian
    },
  ];

  // Insert translations into the database
  await knex('translations').insert(translations.map((translation) => ({
    uuid: knex.raw('uuid_generate_v4()'),
    phrase_uuid: translation.phrase_uuid,
    language_code: translation.language_code,
    translation: translation.translation,
    created_at: knex.fn.now(),
    updated_at: knex.fn.now(),
    created_by: 'system',
    is_deleted: false,
  })));
}
