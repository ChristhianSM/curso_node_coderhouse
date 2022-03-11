const express = require('express');
const router = express.Router();

const { 
    getCarts, 
    deleteCart, 
    getProdcutsByCart, 
    postProductsByCart, 
    deleteProductFromCart } = require('../controllers/cart.controller');


router.post('/' , getCarts)

router.delete('/:id' , deleteCart)

router.get('/:id/products', getProdcutsByCart)

router.post('/:id/products', postProductsByCart)

router.delete('/:id/products/:id_products', deleteProductFromCart)

module.exports = router