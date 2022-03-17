import knex from 'knex';
import products from '../../files/products.js'
import options from './options/mysqlconfig.js'

const database = knex(options);

const proccessInitialDatabase = async() => {
    const existTableCartsProducts = await database.schema.hasTable('carts_products');
    if (existTableCartsProducts) {
        await database.schema.dropTable('carts_products');
    }
    const existTableProducts = await database.schema.hasTable('products');
    if (existTableProducts) {
        await database.schema.dropTable('products');
    }
    const existTableCarts = await database.schema.hasTable('carts');
    if (existTableCarts) {
        await database.schema.dropTable('carts');
    }

    await database.schema.createTable('products', table => {
        table.string('id_product', 40).primary()
        table.string('name' , 20).nullable(false);
        table.string('code' , 50).nullable(false);
        table.float('price').nullable(false);
        table.string('image' , 50).nullable(false);
        table.string('description' , 300).nullable(false);
        table.integer('stock').nullable(false);
        table.boolean('status').nullable(false).defaultTo(true);
        table.double('timestamp').nullable(false);
    });

    await database.schema.createTable('carts', table => {
        table.string('id_cart', 40).primary();
        table.boolean('status').nullable(false).defaultTo(true);
        table.integer('amount');
        table.double('timestamp').nullable(false);
    });

    await database.schema.createTable('carts_products', table => {
        table.increments('id').primary();
        table.integer('amount');
        table.string('id_product', 40).references('id_product').inTable('products');
        table.string('id_cart', 40).references('id_cart').inTable('carts');
    });

    await database('products').insert(products);
    await database.destroy();
}

proccessInitialDatabase();

export {
    proccessInitialDatabase
}
