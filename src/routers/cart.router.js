const express = require('express');
const path = require('path');
const ContainerCart = require('../models/userManagerCart');

const router = express.Router();
const containerCart = new ContainerCart();

router.post('/' , async (req, res) => {
    const respuesta = await containerCart.createCart();
    res.status(200).send(respuesta);
})

router.delete('/:id' , async (req, res) => {
    const idCart = parseInt(req.params.id);
    if (idCart < 0 || isNaN(idCart)) return res.status(400).send({ error: 'Error' ,message : `CartId is incorrect`});
    const message = await containerCart.deleteCart(idCart);
    res.status(200).send(message)
})

router.get('/:id/products', async (req, res) => {
    const idCart = parseInt(req.params.id);
    if (idCart < 0 || isNaN(idCart)) return res.status(400).send({ error: 'Error' ,message : `CartId is incorrect`});

    const products = await containerCart.getProductsForCart(idCart);
    res.status(200).send(products)
})

router.post('/:id/products', async (req, res) => {
    const idCart = parseInt(req.params.id);
    const idProduct = req.body.id;
    console.log(idCart, idProduct)
    if (idCart < 0 || isNaN(idCart)) return res.status(400).send({error: 'Error' , message : `CartId is incorrect`});

    const products = await containerCart.addProductToCart(idCart, idProduct);
    res.status(200).send(products)
})

router.delete('/:id/products/:id_products', async (req, res) => {
    const idCart = parseInt(req.params.id);
    const idProduct = parseInt(req.params.id_products);
    if (idCart < 0 || isNaN(idCart)) return res.status(400).send({ message : `CartId is incorrect`});

    const products = await containerCart.deleteProductToCart(idCart, idProduct);
    res.send(products)
})

module.exports = router