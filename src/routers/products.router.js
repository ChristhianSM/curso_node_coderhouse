const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const { middlewareAuth } = require('../middlewares/middlewaresProducts');

const { Contenedor } = require('../models/UserManagerProducts');
const uploader = require('../services/Upload');

const router = express.Router();

const contenedor = new Contenedor(path.join(__dirname + '/../files/products.txt'));


router.get('/', async (req, res) => {
    const products = await contenedor.getAll();
    res.status(200).send({
        status : products.status,
        message: products.message,
        products : products.payload
    })

    // res.render('products' , {
    //     name : 'Christhian',
    //     products: products.payload
    // })
})

router.get('/:id', async (req, res) => {
    const idProduct = parseInt(req.params.id);
    const products = await contenedor.getAll();
    //Validamos si el id ingresado es positivo o ingreso una letra
    if (idProduct < 0 || isNaN(idProduct)) return res.send({ message : `ProductId is incorrect`});

    //Buscar si existe el id del producto a buscar
    const existId = products.payload.some(product => product.id === idProduct);
    if (!existId) return res.status(400).send({ message : `ProductId ${idProduct} does not exist for Search`});

    const productFound = await contenedor.getById(idProduct); 
    res.status(200).send({
        ...productFound
    });
})

//Metodo post 
router.post('/', uploader.single('file'), middlewareAuth, async (req, res) => {
    const body = req.body;
    
    //Obtenemos el nombre del file 
    // const file = req.file;
    // if (!file) return res.status(500).send({error: "Couldn't upload file"})
    // body.thumbnail = `${req.protocol}://${req.hostname}:5000/img/${file.filename}`;

    const products = await contenedor.getAll();
    let lastId = 0;
    if (products.payload.length !== 0) {
        const lengthProduct = products.payload.length;
        const lastProduct = products.payload[lengthProduct-1];
        lastId = lastProduct.id;
    }

    //Creamos el nuevoProducto
    const newProduct = {
        id: lastId + 1,
        timestamp : Date.now(),
        code : uuidv4(),
        ...body
    }
    //Agregamos el producto para que persista
    const product = await contenedor.save(newProduct);
    
    res.status(201).send({
        status : product.status,
        message: product.message,
        newProduct,
        id: lastId + 1
    })
})

//Actualizar producto 
router.put('/:id' ,middlewareAuth, async (req, res) => {
    const idProduct = parseInt(req.params.id);
    const body = req.body;
    const products = await contenedor.getAll();

    //Validamos si el id ingresado es positivo o ingreso una letra
    if (idProduct < 0 || isNaN(idProduct)) return res.send({ message : `ProductId is incorrect`});

    //Buscar si existe el id del producto a actualizar
    const existId = products.payload.some(product => product.id === idProduct);
    if (!existId) return res.status(400).send({ status: 'error', message : `ProductId ${idProduct} does not exist` });

    const productFound = await contenedor.getById(idProduct);
    const productUpdated = {
        ...productFound.payload,
        ...body,
    }
    
    const productsUpdated = products.payload.map( product => {
        if (product.id === idProduct) {
            return productUpdated;
        }else {
            return product;
        }
    })
    const {status} = await contenedor.saveProducts(productsUpdated);
    res.send({
        status,
        message: `Producto with id ${idProduct} was updated successfully`,
        productUpdated
    })
})

//Eliminar Producto por id 
router.delete('/:id' ,middlewareAuth,  async (req, res) => {
    const idProduct = parseInt(req.params.id);
    const products = await contenedor.getAll();
    
    //Buscar si existe el id a eliminar 
    const existId = products.payload.some(product => product.id === idProduct);
    if (!existId) return res.status(400).send({status: 'error',  message : `ProductId ${idProduct} does not exist for Deleted`});

    //Procedemos a eliminar el producto
    const message = await contenedor.deleteById(idProduct);
    res.send(message)
})

router.get('/productoRandom', async (req, res) => {
    const { payload } = await contenedor.getAll();

    const quantityProducts = payload.length;
    const random = Math.floor((Math.random() * quantityProducts));
    res.send(payload[random])
})


module.exports = router
