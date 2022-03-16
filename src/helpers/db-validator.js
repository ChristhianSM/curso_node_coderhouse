import knex from 'knex';
import options from '../database/mysql/options/mysqlconfig.js'
const database = knex(options);

const existIdProduct = async (idProduct = "") => {
    const result = await database.from('products').select("id_product").where("id_product", idProduct);
    const product = JSON.parse(JSON.stringify(result));
    if (product.length === 0) {
        throw new Error ('El Id no existe')
    }
}

const existIdCart = async (idCart = "") => {
    const result = await database.from('carts').select("id_cart").where("id_cart", idCart);
    const cart = JSON.parse(JSON.stringify(result));
    if (cart.length === 0) {
        throw new Error ('El CartId no existe')
    }
}

const existIdProductFromCart = async (idProduct = "") => {
    const result = await database.from('carts-products').select("id_product").where("id_product", idProduct);
    const cart = JSON.parse(JSON.stringify(result));
    if (cart.length === 0) {
        throw new Error ('El Producto no existe en el carrito de compras')
    }
}

export {
    existIdProduct, 
    existIdCart,
    existIdProductFromCart
}