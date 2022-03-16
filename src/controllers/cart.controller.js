import  express from 'express';
import  path from 'path';
import options from '../database/mysql/options/mysqlconfig.js';

import  ContainerCart from '../models/userManagerCart.js';

const containerCart = new ContainerCart(options, 'carts');

const createCart = async (req, res) => {
    const result = await containerCart.createCart();
    res.status(result.status === "success" ? 200 : 400).json(result);
}

const deleteCart = async (req, res) => {
    const idCart = req.params.id;

    const result = await containerCart.deleteCart(idCart);
    res.status(result.status === "success" ? 200 : 400).json(result);
}

const getProdcutsByCart = async (req, res) => {
    const idCart = req.params.id_cart;

    const result = await containerCart.getProductsForCart(idCart);
    res.status(result.status === "success" ? 200 : 400).json(result);
}

const postProductsByCart = async (req, res) => {
    const idCart = req.params.id_cart;
    const idProduct = req.body.id_product;

    const result = await containerCart.addProductToCart(idCart, idProduct);
    res.status(result.status === "success" ? 200 : 400).json(result);
}

const deleteProductFromCart = async (req, res) => {
    const idCart = req.params.id_cart;
    const idProduct = req.params.id_product;

    const result = await containerCart.deleteProductToCart(idCart, idProduct);
    res.status(result.status === "success" ? 200 : 400).json(result);
}

const deleteProduct = async (req, res) => {
    const idCart = req.params.id_cart;
    const idProduct = req.params.id_product;
    console.log(idCart, idProduct)
    const result = await containerCart.deleteProduct(idCart, idProduct);
    res.status(result.status === "success" ? 200 : 400).json(result);
}

export {
    createCart,
    deleteCart,
    getProdcutsByCart,
    postProductsByCart,
    deleteProductFromCart,
    deleteProduct
}