class Container {

    constructor() {
        this.elements = [];
    }
    //Products
    async getAllProducts() {
        const products = this.elements;

        products.sort( (productA, productB) => {
            if (productA.id > productB.id) return 1;
            return -1
        })
        
        //Ponemos los productos ordenados por id
        this.elements =  products;

        return {
            status: "Success",
            message : "obtained successfully",
            payload : this.elements
        };
      
    }

    async save(product) { 
        
        const data = this.elements;

        //Verificamos si el archivo contiene productos, por que unicamente puede estar creado pero sin productos 
        if (data.length > 0) {
            const products = data;
            const id = products[products.length - 1].id;
            product.id = id + 1 ;
            this.elements.push(product);
            return {
                status : "Success",
                message : "Product saved successfully"
            }
        }
        product.id = 1;
        this.elements.push(product);
        return {
            status : "Success",
            message : "Product saved successfully"
        }
         
    }

    async saveProducts(products = []) {
        try {
            this.elements = products;
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
       
        const products = this.elements;
        console.log(id)
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

    async updateProduct ( id, data ) {
        const products = this.elements;

        //Buscamos el producto a actualizar
        const product = products.some(product => product.id == id);
        if (!product) {
            return {
                status : "Error",
                message : 'Product Not found'
            }
        }
        
        this.elements = this.elements.map( product => {
            if (product.id == id) {
                return {
                    ...product, 
                    ...data
                }
            }
            return product
        })

        return {
            status : "success",
            message : 'Products Updated correctly'
        }
     
    }

    async deleteById (id) {
    
        const products = this.elements;

        //Primero verificamos que el id a eliminar exista 
        const productFind = products.find( product => product.id === id);

        if (productFind) {
            const newProducts = products.filter( product => product.id != id);
            this.elements = newProducts;
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

    async deleteAll () {
        this.elements = [];
        return {
            status: "Success",
            message : `Products removed successfully`
        }
    }

    //Carts
    async getAllCarts() {
        const carts = this.elements;
        return {
            status : 'success',
            message : 'Cart add Correctly',
            payload : carts
        }
    }

    async createCart() {
        const carts = this.elements;

        //Verificamos que el archivo contenga carts
        if (carts.length > 0) {
            //obtenemos el ultimo id 
            const lastId = carts[carts.length - 1].id + 1;
            const cart = {
                id : lastId,
                timestamp : Date.now(),
                products : []
            }
            carts.push(cart);
            this.elements = carts;
            return {
                status : 'success',
                message : 'Cart add Correctly',
                payload : cart
            }
        }

        if (!carts) {
            const newCart = {
                // id: uuidv4(), 
                id: 1, 
                timestamp : Date.now(),
                products : []
            }
                this.elements.push(newCart)
                return {
                    status : 'success',
                    message : 'Cart add Correctly',
                    payload : newCart
                }
        }
        const newCart = {
            id: 1, 
            timestamp : Date.now(),
            products : []
        }
        this.elements.push(newCart);
        return {
            status : 'success',
            message : 'Cart add Correctly',
            payload : newCart
        }
    }

    async getProductsForCart(id) {
      
        const carts = this.elements;
        
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

    async deleteCart(id) {
       
        const carts = this.elements;
        
        //Verificamos si existe el id del carrito para eliminarlo 
        const idExist = carts.some( cart => cart.id === id);
        if (idExist) {
            const newsCarts = carts.filter( cart => cart.id !== id);
          
            this.elements = newsCarts;
            return {
                status : 'success',
                message : 'Cart Delete Correctly'
            }
        }else{
            return {
                status : 'Error',
                message : 'Cart not found'
            }
        }
    }

    async addProductToCart ( id, idProduct ) {
        if (fs.existsSync(this.path)) {
            const carts = await getFetch(this.path);
            
            //Verificamos si existe el id del carrito para agregar el producto 
            const idExist = carts.some( cart => cart.id === id);

            //Verificamos si el producto esta en mi base de datos
            const products = JSON.parse(await fs.promises.readFile('../../files/products.txt', 'utf-8'));

            const idExistProduct = products.some( product => product.id === idProduct);
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