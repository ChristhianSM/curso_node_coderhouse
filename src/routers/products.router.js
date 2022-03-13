const express = require('express');
const { check } = require('express-validator');

const { 
    getProducts, 
    getProductById, 
    postProduct, 
    putProduct, 
    deleteProduct, 
    postProductRandom } = require('../controllers/products.controller');

const { middlewareAuth } = require('../middlewares/middlewaresProducts');
const { validateInputs } = require('../middlewares/validateInputs');

const uploader = require('../services/Upload');
const router = express.Router();

//Get all Products
router.get('/', [
    check('limit', 'Must be a numeric value').optional().isNumeric(),
    check('from', 'Must be a numeric value').optional().isNumeric(),
    validateInputs,
], getProducts)

//Get Product by Id
router.get('/:id', [
] ,
getProductById)

//Add Product 
router.post('/', [
    check('name', 'Name is requerid').not().isEmpty(),
    check('price', 'Price is requerid').not().isEmpty().isNumeric().withMessage('Price Must be a numeric value'),
    check('image', 'Image is requerid').not().isEmpty(),
    check('description', 'Name is requerid').not().isEmpty(),
    check('stock', 'Stock is requerid').not().isEmpty().isNumeric().withMessage('Price Must be a numeric value'),
    validateInputs,
    uploader.single('file'), 
    middlewareAuth
]
, postProduct)

//Updated Product
router.put('/:id',[
    check('name', 'Name is requerid').optional().not().isEmpty(),
    check('price', 'Price is requerid').optional().isNumeric().withMessage('Price Must be a numeric value'),
    check('image', 'Image is requerid').optional(),
    check('description', 'Name is requerid').optional(),
    check('stock', 'Stock is requerid').optional().isNumeric().withMessage('Price Must be a numeric value'),
    validateInputs,
    middlewareAuth,
]
, putProduct)

//Delete Product by id 
router.delete('/:id' ,middlewareAuth,  deleteProduct)

//Get Product Ramdom
router.get('/productoRandom', postProductRandom)


module.exports = router
