import express  from 'express';
import { 
    getCarts, 
    deleteCart, 
    getProdcutsByCart, 
    postProductsByCart, 
    deleteProductFromCart }  from '../controllers/cart.controller.js';
    
const router = express.Router();

router.post('/' , getCarts)

router.delete('/:id' , deleteCart)

router.get('/:id/products', getProdcutsByCart)

router.post('/:id/products', postProductsByCart)

router.delete('/:id/products/:id_products', deleteProductFromCart)

export default router