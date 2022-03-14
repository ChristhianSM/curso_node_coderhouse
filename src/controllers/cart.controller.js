import  express from 'express';
import  path from 'path';

import  ContainerCart from '../models/userManagerCart.js';

const containerCart = new ContainerCart();

const getCarts = async (req, res) => {
    const respuesta = await containerCart.createCart();
    res.status(200).send(respuesta);
}

const deleteCart = async (req, res) => {
    const idCart = parseInt(req.params.id);
    if (idCart < 0 || isNaN(idCart)) return res.status(400).send({ error: 'Error' ,message : `CartId is incorrect`});
    const message = await containerCart.deleteCart(idCart);
    res.status(200).send(message)
}

const getProdcutsByCart = async (req, res) => {
    const idCart = parseInt(req.params.id);
    if (idCart < 0 || isNaN(idCart)) return res.status(400).send({ error: 'Error' ,message : `CartId is incorrect`});

    const products = await containerCart.getProductsForCart(idCart);
    res.status(200).send(products)
}

const postProductsByCart = async (req, res) => {
    const idCart = parseInt(req.params.id);
    const idProduct = req.body.id;
    console.log(idCart, idProduct)
    if (idCart < 0 || isNaN(idCart)) return res.status(400).send({error: 'Error' , message : `CartId is incorrect`});

    const products = await containerCart.addProductToCart(idCart, idProduct);
    res.status(200).send(products)
}

const deleteProductFromCart = async (req, res) => {
    const idCart = parseInt(req.params.id);
    const idProduct = parseInt(req.params.id_products);
    if (idCart < 0 || isNaN(idCart)) return res.status(400).send({ message : `CartId is incorrect`});

    const products = await containerCart.deleteProductToCart(idCart, idProduct);
    res.send(products)
}

export {
    getCarts,
    deleteCart,
    getProdcutsByCart,
    postProductsByCart,
    deleteProductFromCart
}