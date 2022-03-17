import knex from 'knex';
import options from './options/slqiteconfig.js'

const database = knex(options);

const proccessInitialDatabase = async() => {
    const existTableMessages = await database.schema.hasTable('messages');
    if (existTableMessages) {
        await database.schema.dropTable('messages');
    }
    const existTableUsers = await database.schema.hasTable('users');
    if (existTableUsers) {
        await database.schema.dropTable('users');
    }

    await database.schema.createTable('users', table => {
        table.string('id_user', 40).primary();
        table.string('email').nullable(false);
        table.string('user', 30).nullable(false);
    });

    await database.schema.createTable('messages', table => {
        table.string('id_message', 40).primary()
        table.string('message' , 300).nullable(false);
        table.string('timestamp', 30).nullable(false);
        table.string('user', 40)
    });

    await database.destroy();
}

proccessInitialDatabase();