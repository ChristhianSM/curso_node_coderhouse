import  { request, response } from 'express';
import { productDao } from '../daos/index.js';   

const getProducts = async (req=request, res=response) => {

    //Leer los queries para obtener productos por limites
    const { page = 10 , from = 0} = req.query

    const result = await productDao.getAllProducts(parseInt(page));
    res.status(result.status === "success" ? 200 : 400).json(result)
    
}

const getProductById =async (req, res) => {
    const idProduct = (req.params.id);
    if (!idProduct) {
        res.status(400).json({
            status : "Error", 
            message : "ID requerid"
        })
    }
    const result = await productDao.getById(idProduct); 
    res.status(result.status === "success" ? 200 : 400).json(result)
}

const postProduct = async (req, res) => {
    const body = req.body;
    
    //Agregamos el producto para que persista
    const result = await productDao.save(body);
    res.status(result.status === "Success" ? 200 : 400).json(result)
}

const putProduct = async (req, res) => {
    const idProduct = req.params.id;
    const body = req.body;

    const result = await productDao.updateProduct(idProduct, body);
    res.status(result.status === "Success" ? 200 : 400).json(result)
}

const deleteProduct = async (req, res) => {
    const idProduct = req.params.id;
    
    //Procedemos a eliminar el producto
    const result = await productDao.deleteById(idProduct);
    res.status(result.status === "Success" ? 200 : 400).json(result)
}

const deleteAllProduct = async (req, res) => {
    //Procedemos a eliminar todos los  producto
    const result = await productDao.deleteAll();
    res.status(result.status === "Success" ? 200 : 400).json(result)
}

export {
    getProducts,
    getProductById,
    postProduct,
    putProduct,
    deleteProduct,
    deleteAllProduct
}