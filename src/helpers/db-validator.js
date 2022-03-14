import knex from 'knex';
import options from '../database/mysql/options/mysqlconfig.js'
const database = knex(options);

const existIdProduct = async (idProduct = "") => {
    const result = await database.from('products').select("id").where("id_product", idProduct);
    const product = JSON.parse(JSON.stringify(result));
    if (product.length === 0) {
        throw new Error ('El Id no existe')
    }
}

export {
    existIdProduct
}