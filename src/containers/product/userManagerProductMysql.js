import { v4 as uuidv4 } from 'uuid';
import { database } from '../../database/mysql/config.database.js';
// import { proccessInitialDatabase } from '../database/mysql/createTable.js';

class  Container {
    constructor(nameTable){
        this.nameTable = nameTable;
        this.database = this.connectionDB();
        // this.createTable();
    }

    connectionDB () {
        return database;
    }

    // createTable () {
    //     proccessInitialDatabase();
    // }

    async getAll(limit) {
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
}

export default Container