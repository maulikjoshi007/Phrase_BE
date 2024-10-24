import { knex } from 'knex';
let dbConfig = require('../../knexfile');
export default knex(dbConfig.development);