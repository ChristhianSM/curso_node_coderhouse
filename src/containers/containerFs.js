import fs from 'fs'

const getFetch = async (path) => {
    try {
        return JSON.parse(await fs.promises.readFile(path, 'utf-8'));
    } catch (error) {
        return {
            status : 'Error',
            message : error
        }
    }
}

class Container {

    constructor(path) {
        this.path = path;
    }
    //Products
    async getAllProducts() {
        try {
            if (fs.existsSync(this.path)) {
                const products = await getFetch(this.path);

                products.sort( (productA, productB) => {
                    if (productA.id > productB.id) return 1;
                    return -1
                })
                
                //Ponemos los productos ordenados por id
                await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));

                return {
                    status: 'success',
                    message : "Products obtained correctly",
                    payload : products
                };  
            }
            return {
                status: "Error",
                message : "There are no products",
            };
        } catch (error) {
            return {
                status : "Error",
                message : error
            }
        }
    }

    async save(product) { 
        try {
            //Verificamos que exista el documento
            if (fs.existsSync(this.path)) {
                const data = await getFetch(this.path)

                //Verificamos si el archivo contiene productos, por que unicamente puede estar creado pero sin productos 
                if (data !== "" && data.length > 0) {
                    const products = data;
                    const id = products[products.length - 1].id;
                    product.id = id + 1 ;
                    products.push(product);
                    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
                    return {
                        status : "Success",
                        message : "Product saved successfully"
                    }
                }
                product.id = 1;
                await fs.promises.writeFile(this.path, JSON.stringify([product], null, 2));
                return {
                    status : "Success",
                    message : "Product saved successfully"
                }
            }
        } catch (error) {
            return {
                status : "Error",
                message : error
            }
        }
    }

    async saveProducts(products = []) {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
            return {
                status : "Success",
                message : "Product saved successfully"
            }
        } catch (error) {
            return {
                status : "Error",
                message : error
            }
        }
    }
    
    async getById(id) {
        try {
            if (fs.existsSync(this.path)) {
                const products = await getFetch(this.path);
                const productFind = products.find( product => product.id == id);
                if (productFind) {
                    return {
                        status: 'success',
                        message : "Product found",
                        payload : productFind
                    }
                }else{
                    return {
                        status : 'Error',
                        message : "Product not found",
                    }
                }
            }
        } catch (error) {
            return {
                status : "Error",
                message : error
            }
        }
    }

    async updateProduct ( id, data ) {
        try {
            if (fs.existsSync(this.path)) {
                let products = await getFetch(this.path);
                const productFind = products.some( product => product.id == id);
                if (!productFind) {
                    return {
                        status: 'Error',
                        message : "Product not found"
                    }
                }

                products = products.map( product => {
                    if (product.id == id) {
                        return {
                            ...product,
                            ...data
                        }
                    }
                    return product
                })

                await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));

                return {
                    status : 'Success',
                    message : "Product updated correctly",
                }
            }
        } catch (error) {
            return {
                status : "Error",
                message : error
            }
        }
    }

    async deleteById (id) {
        try {
            if (fs.existsSync(this.path)) {
                const products = await getFetch(this.path)

                //Primero verificamos que el id a eliminar exista 
                const productFind = products.find( product => product.id == id);

                if (productFind) {
                    const newProducts = products.filter( product => product.id != id);
                    await fs.promises.writeFile(this.path, JSON.stringify(newProducts, null, 2));
                    return {
                        status : "Success", 
                        message : "Product removed successfully"
                    }
                }else{
                    return {
                        status: 'Error',
                        message : `Producto with id ${id} does not exist`
                    }
                }
            }
            
        } catch (error) {
            return {
                status : "Error",
                message : error
            }
        }
    }

    async deleteAll () {
        try {
            if (fs.existsSync(this.path)) {
                await fs.promises.writeFile(this.path, "");
                return {
                    status: "Success",
                    message : `Products removed successfully`
                }
            }
        } catch (error) {
            return {
                status : "Error",
                message : error
            }
        }
    }

    //Carts
    async getAllCarts() {
        if (fs.existsSync(this.path)) {
            try {
                const carts = await getFetch(this.path)
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
        if (fs.existsSync(this.path)) {
            const carts = await getFetch(this.path) || "";

            //Verificamos que el archivo contenga carts
            if (!carts) {
                const newCart = {
                    // id: uuidv4(), 
                    id: 1, 
                    timestamp : Date.now(),
                    products : []
                }
                try {
                    await fs.promises.writeFile(this.path, JSON.stringify([newCart], null, 2));
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
                    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
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
            await fs.promises.writeFile(this.path, JSON.stringify([newCart], null, 2));
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

    async getProductsForCart(id) {
        if (fs.existsSync(this.path)) {
            const carts = await getFetch(this.path);
            
            //Verificamos si existe el id del carrito para obtener sus productos
            const idExist = carts.some( cart => cart.id == id);

            if (idExist) {
                const products = carts.find( cart => cart.id == id);
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

    async deleteCart(id) {
        if (fs.existsSync(this.path)) {
            const carts = await getFetch(this.path);
            
            //Verificamos si existe el id del carrito para eliminarlo 
            const idExist = carts.some( cart => cart.id == id);
            if (idExist) {
                const newsCarts = carts.filter( cart => cart.id != id);
                try {
                    await fs.promises.writeFile(this.path, JSON.stringify(newsCarts, null, 2));
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

    async addProductToCart ( id, idProduct ) {
        if (fs.existsSync(this.path)) {
            const carts = await getFetch(this.path);
            
            //Verificamos si existe el id del carrito para agregar el producto 
            const idExist = carts.some( cart => cart.id == id);

            //Verificamos si el producto esta en mi base de datos
            const products = JSON.parse(await fs.promises.readFile('./src/files/products.txt', 'utf-8'));

            const idExistProduct = products.some( product => product.id == idProduct);
            let currentCart = [];

            if (idExist && idExistProduct) {
                const cartsUpdated = carts.map( cart => {
                    if (cart.id == id) {
                        cart.products.push(idProduct);
                        currentCart = cart;
                        return cart
                    }else{
                        return cart
                    }
                })
                
                try {
                    await fs.promises.writeFile(this.path, JSON.stringify(cartsUpdated, null, 2));
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
        if (fs.existsSync(this.path)) {
            const carts = await getFetch(this.path);
            
            //Verificamos si existe el id del carrito para agregar el producto 
            const idExist = carts.some( cart => cart.id == id);
            if (!idExist) {
                return {
                    status : 'success',
                    message : 'CartId Not Exist'
                }
            }

            //Verificamos si exite el id del producto a eliminar
            const cartFound = carts.find( cart => cart.id == id);
            
            const idProductExist = cartFound.products.some( product => product == idProduct);

            if (idExist && idProductExist) {
                const cartsUpdated = carts.map( cart => {
                    if (cart.id == id) {
                        cart.products =  cart.products.filter( product => product != idProduct);
                        return cart
                    }else{
                        return cart
                    }
                })
                try {
                    await fs.promises.writeFile(this.path, JSON.stringify(cartsUpdated, null, 2));
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

export default Container