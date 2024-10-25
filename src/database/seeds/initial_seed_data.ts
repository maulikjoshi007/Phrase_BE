import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Delete ALL existing entries to avoid duplicates
  await knex('translations').del();
  await knex('phrases').del();
  await knex('languages').del();

  // Insert languages
  const languageData = [
    { language_code: 'en', language_name: 'English' },
    { language_code: 'fr', language_name: 'French' },
    { language_code: 'es', language_name: 'Spanish' },
    { language_code: 'de', language_name: 'German' },
    { language_code: 'it', language_name: 'Italian' },
  ];

  const languages = await knex('languages')
    .insert(
      languageData.map((lang) => ({
        uuid: knex.raw('uuid_generate_v4()'),
        language_code: lang.language_code,
        language_name: lang.language_name,
        created_at: knex.fn.now(),
        updated_at: knex.fn.now(),
        created_by: 'system',
        is_deleted: false,
      }))
    )
    .returning('*');

  // Create a map for easy access to each language
  const languageMap = languages.reduce((map, lang) => {
    map[lang.language_code] = lang;
    return map;
  }, {} as Record<string, any>);

  // Insert phrases
  const phraseData = [
    { phrase: 'Hi, I’m a phrase', status: 'ACTIVE' },
    { phrase: 'How are you?', status: 'PENDING' },
    { phrase: 'Good morning!', status: 'DELETED' },
    { phrase: 'What is your name?', status: 'ACTIVE' },
    { phrase: 'Have a nice day!', status: 'SPAM' },
  ];

  const phrases = await knex('phrases')
    .insert(
      phraseData.map((phrase) => ({
        uuid: knex.raw('uuid_generate_v4()'),
        phrase: phrase.phrase,
        status: phrase.status,
        created_at: knex.fn.now(),
        updated_at: knex.fn.now(),
        is_deleted: false,
        created_by: 'system',
      }))
    )
    .returning('*');

  // Insert translations for each language for each phrase
  const translations = [
    {
      phrase_uuid: phrases[0].uuid,
      language_code: languageMap['fr'].language_code,
      translation: 'Salut, je suis une phrase',
    },
    {
      phrase_uuid: phrases[0].uuid,
      language_code: languageMap['es'].language_code,
      translation: 'Hola, soy una frase',
    },
    {
      phrase_uuid: phrases[1].uuid,
      language_code: languageMap['fr'].language_code,
      translation: 'Comment ça va?',
    },
    {
      phrase_uuid: phrases[1].uuid,
      language_code: languageMap['es'].language_code,
      translation: '¿Cómo estás?',
    },
    {
      phrase_uuid: phrases[2].uuid,
      language_code: languageMap['de'].language_code,
      translation: 'Guten Morgen!',
    },
    {
      phrase_uuid: phrases[3].uuid,
      language_code: languageMap['de'].language_code,
      translation: 'Wie heißt du?',
    },
    {
      phrase_uuid: phrases[4].uuid,
      language_code: languageMap['it'].language_code,
      translation: 'Buona giornata!',
    },
  ];

  await knex('translations').insert(
    translations.map((translation) => ({
      uuid: knex.raw('uuid_generate_v4()'),
      phrase_uuid: translation.phrase_uuid,
      language_code: translation.language_code,
      translation: translation.translation,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
      created_by: 'system',
      is_deleted: false,
    }))
  );
}
