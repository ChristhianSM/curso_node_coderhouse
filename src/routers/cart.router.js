import express  from 'express';
import { check } from 'express-validator';
import {  
    deleteCart, 
    getProdcutsByCart, 
    postProductsByCart, 
    deleteProductFromCart, 
    createCart,
    deleteProduct}  from '../controllers/cart.controller.js';

import {  existIdCart, existIdProduct, existIdProductFromCart } from '../helpers/db-validator.js';
import { validateInputs } from '../middlewares/validateInputs.js';
    
const router = express.Router();

router.post('/' , createCart)

router.delete('/:id' ,[
    check('id', 'ID is requerid').not().isEmpty().custom(existIdCart),
    validateInputs,
], deleteCart)

router.get('/:id_cart/products', [
    check('id', 'ID is requerid').not().isEmpty().custom(existIdCart),
],getProdcutsByCart)

router.post('/:id_cart/products',[
    check('id_cart').custom(existIdCart),
    check('id_product').custom(existIdProduct),
    validateInputs,
], postProductsByCart)

router.delete('/:id_cart/products/:id_product',[
    check('id_cart').custom(existIdCart),
    check('id_product').custom(existIdProductFromCart),
], deleteProductFromCart)

router.delete('/:id_cart/products/:id_product/all',[
    check('id_cart').custom(existIdCart),
    check('id_product').custom(existIdProductFromCart),
], deleteProduct)

export default router