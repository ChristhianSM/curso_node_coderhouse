import  { v4 as uuidv4 } from 'uuid';
import { database } from '../database/mysql/config.database.js';

class Container {
    constructor (nameTable) {
        this.nameTable = nameTable;

        this.database = this.connection();
    }

    connection() {
        return database;
    }

    //Products
    async getAllProducts(limit) {
        try {
            //Mostramos solo los productos que estan activos
            const [results, resultTotal] = await Promise.all([
                this.database.from(this.nameTable).select("*").where('status', true).limit(limit),
                this.database.count('id_product').from(this.nameTable).where('status', true)
            ])
            const products = JSON.parse(JSON.stringify(results));
            const total = JSON.parse(JSON.stringify(resultTotal));
            const totalProductsShow = products.length;
            
            //Eliminamos los campos que no deberian mostrarse al usuario
            products.forEach( product => {
                delete product.status;
                delete product.timestamp;
            })
            return {
                status : "success",
                message : 'Products obtained correctly',
                payload : {
                    total : total[0]['count(`id_product`)'],
                    totalProductsShow,
                    products
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

    async getById(id) {
        try {
            const results = await this.database.from("products").select('*').where('id_product', id);
            const products = JSON.parse(JSON.stringify(results))
            return {
                status : "success",
                message : 'Products obtained correctly',
                payload : products
            }
        } catch (error) {
            return {
                status : "error",
                message : 'Ocurrio un problema con la BD',
                error
            }
        }
    }

    async save(product) {
        const newProduct = {
            id_product: uuidv4(),
            code : uuidv4(),
            ...product,
            timestamp : Date.now(),
        }

        try {
            await this.database.from(this.nameTable).insert(newProduct);
            return {
                status : "success",
                message : 'Products saved correctly',
                payload : newProduct
            }
        } catch (error) {
            return {
                status : "error",
                message : 'Ocurrio un problema con la BD',
                error
            }
        }
    }

    async updateProduct ( id, data ) {
        try {
            await this.database.from(this.nameTable).where('id_product', id).update(data);
            return {
                status : "success",
                message : 'Products Updated correctly'
            }
        } catch (error) {
            return {
                status : "error",
                message : 'Ocurrio un problema con la BD',
                error
            }
        }
    }
    
    async deleteById (id) {
        try {
            await this.database.from(this.nameTable).where('id_product', id).update({status: false});
            return {
                status : "success",
                message : 'Products Deleted correctly'
            }
        } catch (error) {
            return {
                status : "error",
                message : 'Ocurrio un problema con la BD',
                error
            }
        }
    }

    async deleteAll () {
        try {
            await this.database.from(this.nameTable).del();
            
        } catch (error) {
            return {
                status : "error",
                message : 'Ocurrio un problema con la BD',
                error
            }
        }
    }

    //Carts
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
                await this.database.from('carts_products').insert({id_cart: id, id_product: idProduct, amount: 1});
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

export default Container