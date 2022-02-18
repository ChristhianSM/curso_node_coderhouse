const fs = require('fs');

class  Contenedor {
    constructor(nameFile){
        this.nameFile = nameFile;
    }

    async save(product) {
    
        try {
            //Verificamos que exista el documento
            if (fs.existsSync(this.nameFile)) {
                const data = (await fs.promises.readFile(this.nameFile, "utf-8"));

                //Verificamos si el archivo contiene productos, por que unicamente puede estar creado pero sin productos 
                if (data !== "" && JSON.parse(data).length > 0) {
                    const products = JSON.parse(data);
                    const id = products[products.length - 1].id;
                    product.id = id + 1 ;
                    products.push(product);
                    await fs.promises.writeFile(this.nameFile, JSON.stringify(products, null, 2));
                    return {
                        status : "Success",
                        message : "Product saved successfully"
                    }
                }else{
                    product.id = 1;
                    await fs.promises.writeFile(this.nameFile, JSON.stringify([product], null, 2));
                    return {
                        status : "Success",
                        message : "Product saved successfully"
                    }
                }
            }else{
                product.id = 1;
                await fs.promises.writeFile(this.nameFile, JSON.stringify([product], null, 2));
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
            await fs.promises.writeFile(this.nameFile, JSON.stringify(products, null, 2));
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
            if (fs.existsSync(this.nameFile)) {
                const products = JSON.parse(await fs.promises.readFile(this.nameFile, "utf-8"));
                const productFind = products.find( product => product.id === id);
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

    async getAll() {
        try {
            if (fs.existsSync(this.nameFile)) {
                const products = JSON.parse(await fs.promises.readFile(this.nameFile, "utf-8"));
                products.sort( (productA, productB) => {
                    if (productA.id > productB.id) return 1;
                    return -1
                })
                
                //Ponemos los productos ordenados por id
                await fs.promises.writeFile(this.nameFile, JSON.stringify(products, null, 2));

                return {
                    status: 'success',
                    mensaje : "Products obtained correctly",
                    payload : products
                };  
            }else{
                return {
                    status: "Error",
                    mensaje : "There are no products",
                };
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
            if (fs.existsSync(this.nameFile)) {
                const products = JSON.parse(await fs.promises.readFile(this.nameFile, "utf-8"));

                //Primero verificamos que el id a eliminar exista 
                const productFind = products.find( product => product.id === id);

                if (productFind) {
                    const newProducts = products.filter( product => product.id != id);
                    await fs.promises.writeFile(this.nameFile, JSON.stringify(newProducts, null, 2));
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
            if (fs.existsSync(this.nameFile)) {
                await fs.promises.writeFile(this.nameFile, "");
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
}

module.exports = {
    Contenedor
}