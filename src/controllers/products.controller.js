import  { request, response } from 'express';
import  { Contenedor } from "../models/UserManagerProducts.js";
import { __dirname } from '../helpers/getDirname.js'
import options from '../database/mysql/options/mysqlconfig.js'

const contenedor = new Contenedor(options, 'products');

const getProducts = async (req=request, res=response) => {

    //Leer los queries para obtener productos por limites
    const { limit = 10 , from = 0} = req.query

    const result = await contenedor.getAll(parseInt(limit));
    res.status(result.status === "success" ? 200 : 400).json(result)


    // res.render('products' , {
    //     name : 'Christhian',
    //     products: products.payload
    // })
}

const getProductById =async (req, res) => {
    const idProduct = parseInt(req.params.id);
    
    const result = await contenedor.getById(idProduct); 
    res.status(result.status === "success" ? 200 : 400).json(result)
}

const postProduct = async (req, res) => {
    const body = req.body;
    
    //Agregamos el producto para que persista
    const result = await contenedor.save(body);
    res.status(result.status === "success" ? 200 : 400).json(result)
}

const putProduct = async (req, res) => {
    const idProduct = req.params.id;
    const body = req.body;

    const result = await contenedor.updateProduct(idProduct, body);
    res.status(result.status === "success" ? 200 : 400).json(result)
}

const deleteProduct = async (req, res) => {
    const idProduct = req.params.id;
   
    //Procedemos a eliminar el producto
    const result = await contenedor.deleteById(idProduct);
    res.status(result.status === "success" ? 200 : 400).json(result)
}

const deleteAllProduct = async (req, res) => {

    //Procedemos a eliminar todos los  producto
    const result = await contenedor.deleteAll();
    res.status(result.status === "success" ? 200 : 400).json(result)
}

export {
    getProducts,
    getProductById,
    postProduct,
    putProduct,
    deleteProduct,
    deleteAllProduct
}