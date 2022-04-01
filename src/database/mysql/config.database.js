import knex from 'knex'
import options from './options/mysqlconfig.js'

 export const database = knex(options);
