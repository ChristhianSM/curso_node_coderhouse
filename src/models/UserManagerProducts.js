import knex from 'knex';
import { v4 as uuidv4 } from 'uuid';
// import { proccessInitialDatabase } from '../database/mysql/createTable.js';

class  Contenedor {
    constructor(options, nameTable){
        this.options = options;
        this.nameTable = nameTable;

        // this.createTable();
    }

    // async createTable () {
    //     proccessInitialDatabase();
    // }

    async getAll(limit) {
        try {
            const database = knex(this.options);

            //Mostramos solo los productos que estan activos
            const [results, resultTotal] = await Promise.all([
                database.from(this.nameTable).select("*").where('status', true).limit(limit),
                database.count('id_product').from(this.nameTable).where('status', true)
            ])
            const products = JSON.parse(JSON.stringify(results));
            const total = JSON.parse(JSON.stringify(resultTotal));
            const totalProductsShow = products.length;
            
            //Eliminamos los campos que no deberian mostrarse al usuario
            products.forEach( product => {
                delete product.id;
                delete product.id_product;
                delete product.status;
                delete product.timestamp;
            })

            return {
                status : "success",
                message : 'Products obtained correctly',
                payload : {
                    total : total[0]['count(`id`)'],
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
            const database = knex(this.options);
            const results = await database.from("products").select('*').where('id_product', id);
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
            const database = knex(this.options);
            await database.from(this.nameTable).insert(newProduct);
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
            const database = knex(this.options);
            await database.from(this.nameTable).where('id_product', id).update(data);
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
            const database = knex(this.options);
            await database.from(this.nameTable).where('id_product', id).update({status: false});
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
            const database = knex(this.options);
            await database.from(this.nameTable).del();
            
        } catch (error) {
            return {
                status : "error",
                message : 'Ocurrio un problema con la BD',
                error
            }
        }
    }
}

export {
    Contenedor
}