const path = require('path');
const fs = require('fs');

const { v4: uuidv4 } = require('uuid');

const pathFile = path.join(__dirname + '/../files/cart.txt');
const pathFileProducts = path.join(__dirname + '/../files/products.txt');

const getFetch = async () => {
    try {
        return JSON.parse(await fs.promises.readFile(pathFile, 'utf-8'));
    } catch (error) {
        return {
            status : 'Error',
            message : error
        }
    }
    
}

class ContainerCart {

    async getCarts() {
        if (fs.existsSync(pathFile)) {
            try {
                const carts = JSON.parse(await fs.promises.readFile(pathFile, 'utf-8'));
                return {
                    status : 'success',
                    message : 'Cart add Correctly',
                    payload : carts
                }
            } catch (error) {
                return {
                    status : 'error',
                    message : error
                }
            }   
        }
        return {
            status : 'error',
            message : 'File not exist'
        }
    }

    async createCart() {
        if (fs.existsSync(pathFile)) {
            const carts = JSON.parse(await fs.promises.readFile(pathFile, 'utf-8')) || "";

            //Verificamos que el archivo contenga carts
            if (!carts) {
                const newCart = {
                    // id: uuidv4(), 
                    id: 1, 
                    timestamp : Date.now(),
                    products : []
                }
                try {
                    await fs.promises.writeFile(pathFile, JSON.stringify([newCart], null, 2));
                    return {
                        status : 'success',
                        message : 'Cart add Correctly',
                        payload : newCart
                    }
                } catch (error) {
                    return {
                        status : 'error',
                        message : error
                    }
                }
            }

            if (carts.length > 0) {
                //obtenemos el ultimo id 
                const lastId = carts[carts.length - 1].id + 1;
                const cart = {
                    id : lastId,
                    timestamp : Date.now(),
                    products : []
                }
                carts.push(cart);
                try {
                    await fs.promises.writeFile(pathFile, JSON.stringify(carts, null, 2));
                    return {
                        status : 'success',
                        message : 'Cart add Correctly',
                        payload : cart
                    }
                } catch (error) {
                    return {
                        status : 'error',
                        message : error
                    }
                }
            }
        }
        const newCart = {
            // id: uuidv4(), 
            id: 1, 
            timestamp : Date.now(),
            products : []
        }
        try {
            await fs.promises.writeFile(pathFile, JSON.stringify([newCart], null, 2));
            return {
                status : 'success',
                message : 'Cart add Correctly',
                payload : newCart
            }
        } catch (error) {
            return {
                status : 'error',
                message : error
            }
        }
    }

    async deleteCart(id) {
        if (fs.existsSync(pathFile)) {
            const carts = JSON.parse(await fs.promises.readFile(pathFile, 'utf-8'));
            
            //Verificamos si existe el id del carrito para eliminarlo 
            const idExist = carts.some( cart => cart.id === id);
            console.log(id)
            if (idExist) {
                const newsCarts = carts.filter( cart => cart.id !== id);
                try {
                    await fs.promises.writeFile(pathFile, JSON.stringify(newsCarts, null, 2));
                    return {
                        status : 'success',
                        message : 'Cart Delete Correctly'
                    }
                } catch (error) {
                    return {
                        status : 'success',
                        message : error
                    }
                }  
            }else{
                return {
                    status : 'Error',
                    message : 'Cart not found'
                }
            }
        }
        return {
            status : 'Error',
            message : 'File not found'
        }
    }

    async getProductsForCart(id) {
        if (fs.existsSync(pathFile)) {
            const carts = await getFetch();
            
            //Verificamos si existe el id del carrito para obtener sus productos
            const idExist = carts.some( cart => cart.id === id);

            if (idExist) {
                const products = carts.find( cart => cart.id === id);
                return {
                    status : 'success',
                    message : `Cart ${id} products obtained successfully`,
                    payload : products.products
                }
            }else{
                return {
                    status : 'Error',
                    message : 'Cart not found'
                }
            }
        }
        return {
            status : 'Error',
            message : 'File not found'
        }
    }

    async addProductToCart ( id, idProduct ) {
        if (fs.existsSync(pathFile)) {
            const carts = await getFetch();
            
            //Verificamos si existe el id del carrito para agregar el producto 
            const idExist = carts.some( cart => cart.id === id);

            //Verificamos si el producto esta en mi base de datos
            const products = JSON.parse(await fs.promises.readFile(pathFileProducts, 'utf-8'));

            const idExistProduct = products.some( product => product.id === idProduct);
            let currentCart = [];

            if (idExist && idExistProduct) {
                const cartsUpdated = carts.map( cart => {
                    if (cart.id === id) {
                        cart.products.push(idProduct);
                        currentCart = cart;
                        return cart
                    }else{
                        return cart
                    }
                })
                
                try {
                    await fs.promises.writeFile(pathFile, JSON.stringify(cartsUpdated, null, 2));
                    return {
                        status : 'success',
                        message : 'Cart Added Correctly',
                        payload : currentCart
                    }
                } catch (error) {
                    return {
                        status : 'success',
                        message : error
                    }
                }  
            }else{
                return {
                    status : 'Error',
                    message : 'Cart not found or Product not found'
                }
            }
        }
        return {
            status : 'Error',
            message : 'File not found'
        }
    }

    async deleteProductToCart ( id, idProduct ) {
        if (fs.existsSync(pathFile)) {
            const carts = await getFetch();
            
            //Verificamos si existe el id del carrito para agregar el producto 
            const idExist = carts.some( cart => cart.id === id);
            if (!idExist) {
                return {
                    status : 'success',
                    message : 'CartId Not Exist'
                }
            }

            //Verificamos si exite el id del producto a eliminar
            const cartFound = carts.find( cart => cart.id === id);
            
            const idProductExist = cartFound.products.some( product => product === idProduct);

            if (idExist && idProductExist) {
                const cartsUpdated = carts.map( cart => {
                    if (cart.id === id) {
                        cart.products =  cart.products.filter( product => product !== idProduct);
                        return cart
                    }else{
                        return cart
                    }
                })
                try {
                    await fs.promises.writeFile(pathFile, JSON.stringify(cartsUpdated, null, 2));
                    return {
                        status : 'success',
                        message : 'Product Delete Correctly',
                        payload : cartsUpdated
                    }
                } catch (error) {
                    return {
                        status : 'success',
                        message : error
                    }
                }  
            }else{
                return {
                    status : 'Error',
                    message : 'Cart not found or Product not Found'
                }
            }
        }
        return {
            status : 'Error',
            message : 'File not found'
        }
    }
}

module.exports = ContainerCart