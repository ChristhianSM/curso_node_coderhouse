import knex from 'knex';
import  { v4 as uuidv4 } from 'uuid';

class ContainerCart {
    constructor (options, nameTable) {
        this.options = options;
        this.nameTable = nameTable;

        this.database = this.connection();
    }

    connection() {
        return knex(this.options);
    }

    async createCart() {
        const newCart = {
            id_cart : uuidv4(),
            timestamp : Date.now(),
            amount: 0,
        }
        try {
            await this.database.from(this.nameTable).insert(newCart);
            return {
                status : "success",
                message : 'Cart created correctly',
                payload : newCart
            }
        } catch (error) {
            return {
                status : "error",
                message : 'Ocurrio un problema con la BD',
                error
            }
        }
    }

    async getCart() {
        
    }

    async deleteCart(id) {
        try {
            await this.database.from(this.nameTable).where('id_cart', id).update({status:false});
            return {
                status : "success",
                message : 'Cart deleted correctly'
            }
        } catch (error) {
            return {
                status : "error",
                message : 'Ocurrio un problema con la BD',
                error
            }
        }
    }

    async getProductsForCart(id) {
        try {
            const results = await this.database.from('carts_products').select('id_product','amount').where('id_cart', id);
            const products = JSON.parse(JSON.stringify(results));

            //Guardamos solo los id de los productos 
            const arrayIdProducts = products.map( product => product.id_product);

            const resultsProducts = await this.database.from('products')
                                                        .select('name', 'price', 'image', 'description')
                                                        .whereIn('id_product',arrayIdProducts);
            const resultsProductsFormated = JSON.parse(JSON.stringify(resultsProducts));

            //Agregamos el amount de cada producto 
            const arrayProductsShow = resultsProductsFormated.map( (product, index) => {
                return {
                    ...product,
                    amount : products[index].amount
                }
            })

            console.log(arrayProductsShow)

            return {
                status : "success",
                message : 'Products Obtenidos correctly',
                payload: arrayProductsShow
            }
        } catch (error) {
            return {
                status : "error",
                message : 'Ocurrio un problema con la BD',
                error
            }
        }
    }

    async addProductToCart ( id, idProduct ) {
        try {
            //Verificamos si el producto existe en el carrito de compras, para aumentarle la cantidad
            const resultAmount = await this.database.from('carts_products').select('amount').where({'id_cart' :id , 'id_product': idProduct});
            let amount = JSON.parse(JSON.stringify(resultAmount));
            if (amount.length === 0) {
                const results = await this.database.from('carts_products').insert({id_cart: id, id_product: idProduct, amount: 1});
                return {
                    status : "success",
                    message : 'Product added correctly'
                }
            }
            amount = amount[0].amount + 1;
            const results = await this.database.from('carts_products').where({id_cart: id, id_product: idProduct})
            .update({amount})
            return {
                status : "success",
                message : 'Amount Product updated correctly'
            }
        } catch (error) {
            return {
                status : "error",
                message : 'Ocurrio un problema con la BD',
                error
            }
        }
    }

    async deleteProductToCart ( id, idProduct ) {
        try {
            const resultAmount = await this.database.from('carts_products').select('amount').where({'id_cart' :id , 'id_product': idProduct});
            let amount = JSON.parse(JSON.stringify(resultAmount));
            if (amount[0].amount === 1) {
                await this.database.from('carts_products').where({id_cart: id, id_product: idProduct}).del();
                return {
                    status : "success",
                    message : 'Product Deleted Correctly'
                }
            }

            if (amount[0].amount !== 0) {
                amount = amount[0].amount - 1
                const results = await this.database.from('carts_products').where({id_cart: id, id_product: idProduct}).update({amount})
                return {
                    status : "success",
                    message : 'Cantidad reducida'
                }
            }
        } catch (error) {
            return {
                status : "error",
                message : 'Ocurrio un problema con la BD',
                error
            }
        }
    }

    async deleteProduct ( id, idProduct ) {
        try {
            await this.database.from('carts_products').where({id_cart: id, id_product: idProduct}).del();
            return {
                status : "success",
                message : 'Product Deleted Correctly'
            }
        } catch (error) {
            return {
                status : "error",
                message : 'Ocurrio un problema con la BD',
                error
            }
        }
    }
}

export default ContainerCart