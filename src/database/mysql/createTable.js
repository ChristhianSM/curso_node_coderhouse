import knex from 'knex';
import products from '../../files/products.js'
import options from './options/mysqlconfig.js'

const database = knex(options);

const proccessInitialDatabase = async() => {
    const existTableProducts = await database.schema.hasTable('products');
    console.log(products)
    if (existTableProducts) {
        await database.schema.dropTable('products');
    }

    await database.schema.createTable('products', table => {
        table.increments('id');
        table.string('id_product' , 40).nullable(false);
        table.string('name' , 20).nullable(false);
        table.string('code' , 50).nullable(false);
        table.float('price').nullable(false);
        table.string('image' , 50).nullable(false);
        table.string('description' , 300).nullable(false);
        table.integer('stock').nullable(false);
        table.boolean('status').nullable(false).defaultTo(true);
        table.double('timestamp').nullable(false);
    });

    await database('products').insert(products);
    await database.destroy();
}

proccessInitialDatabase();