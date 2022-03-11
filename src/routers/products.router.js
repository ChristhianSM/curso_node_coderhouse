const express = require('express');

const { 
    getProducts, 
    getProductById, 
    postProduct, 
    putProduct, 
    deleteProduct, 
    postProductRandom } = require('../controllers/products.controller');

const { middlewareAuth } = require('../middlewares/middlewaresProducts');

const uploader = require('../services/Upload');
const router = express.Router();

//Get all Products
router.get('/', getProducts)

//Get Product by Id
router.get('/:id', getProductById)

//Add Product 
router.post('/', uploader.single('file'), middlewareAuth, postProduct)

//Updated Product
router.put('/:id' ,middlewareAuth, putProduct)

//Delete Product by id 
router.delete('/:id' ,middlewareAuth,  deleteProduct)

//Get Product Ramdom
router.get('/productoRandom', postProductRandom)


module.exports = router
