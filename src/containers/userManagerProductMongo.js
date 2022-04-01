import { dbConnection } from '../database/mongo/config.database.js';
import { v4 as uuidv4 } from 'uuid';
import Product from '../models/product.js'

class  Container {
    constructor( nameTable){
        this.nameTable = nameTable;
        this.connectionDB();
    }

    connectionDB () {
        dbConnection();
    }

    async getAll(limit) {
        try {
            //Mostramos solo los productos que estan activos
            const [total, products] = await Promise.all([
                Product.countDocuments({status: true}),
                Product.find({status: true})
            ])
            
            //Eliminamos los campos que no deberian mostrarse al usuario
            products.forEach( product => {
                delete product.status;
                delete product.timestamp;
            })
            return {
                status : "success",
                message : 'Products obtained correctly',
                payload : {
                    total,
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
            const product = await Product.findById(id);
            return {
                status : "success",
                message : 'Products obtained correctly',
                payload : product
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
            code : uuidv4(),
            ...product,
            timestamp : Date.now(),
        }

        try {
            const productCreated = new Product( newProduct ); 
            await productCreated.save();

            return {
                status : "success",
                message : 'Products saved correctly',
                payload : newProduct
            }
        } catch (error) {
            
            console.log(error)
            return {
                status : "error",
                message : 'Ocurrio un problema con la BD',
                error
            }
        }
    }

    async updateProduct ( id, data ) {
        try {
            await Product.findByIdAndUpdate(id, data);
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
            //Cambiamos el estado del producto, eliminacion logica 
            await Product.findByIdAndUpdate(id, {status: false});
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
            await Product.updateMany({status: false});
            return {
                status : "success",
                message : 'Products Deleteded correctly'
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