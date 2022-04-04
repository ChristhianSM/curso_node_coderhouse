import { dbConnection } from '../database/mongo/config.database.js';
import { v4 as uuidv4 } from 'uuid';
import Product from '../models/product.js'
import Cart from '../models/Cart.js'

class  Container {
    constructor( nameTable ){
        this.nameTable = nameTable;
        this.connectionDB();
    }

    connectionDB () {
        dbConnection();
    }

    async getAllProducts(limit) {
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

    //Carts
    async createCart() {
        const newCart = {
            timestamp : Date.now(),
            products: [],
        }
        try {
            const cartCreated = new Cart(newCart);
            await cartCreated.save();

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
            const cartDeleted = await Cart.findByIdAndDelete(id);
            if (cartDeleted) {
                return {
                    status : "success",
                    message : 'Cart deleted correctly'
                }
            }
            return {
                status : "error",
                message : 'No se pudo eliminar Cart'
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
            //Verificar si el carrito existe
            const cart = await Cart.findById(id);
            if (!cart) {
                return {
                    status : "Error",
                    message : 'Cart Not found'
                }
            }
            //Verificamos si el producto existe en el carrito de compras, para aumentarle la cantidad
            const existProduct = cart.products.some( product => product.id_product === idProduct);
            if (existProduct) {
                await Cart.findOneAndUpdate({_id : id, "products.id_product": idProduct}, { $inc : {"products.$.amount": 1}});
                return {
                    status : "success",
                    message : 'Amount Product updated correctly'
                }
            }
            await Cart.findOneAndUpdate({_id : id}, { $addToSet : {"products" : {"id_product": idProduct, "amount": 1}}});
            return {
                status : "success",
                message : 'Product Added correctly'
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
            //Verificamos si el producto que existe en el carrito de compras, su cantidad es mas de 0
            const cart = await Cart.findById(id);
            if (!cart) {
                return {
                    status : "Error",
                    message : 'Cart Not found'
                }
            }
            const product = cart.products.find( product => product.id_product === idProduct);
            if (product.amount > 1) {
                await Cart.findOneAndUpdate({_id : id, "products.id_product": idProduct}, { $inc : {"products.$.amount": - 1}});
                return {
                    status : "success",
                    message : 'Cantidad reducida'
                }
            }
            await Cart.updateOne({_id : id, "products.id_product": idProduct}, { $pull : { 'products' : { $elemMatch: { 'id_product': { $eq: idProduct } } } } });
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

    async deleteProduct ( id, idProduct ) {
        try {
            await Cart.findOneAndDelete({_id : id, "products.id_product": idProduct});
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