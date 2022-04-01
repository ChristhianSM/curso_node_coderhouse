import express from 'express';
import { check } from 'express-validator';

import { 
    getProducts, 
    getProductById, 
    postProduct, 
    putProduct, 
    deleteProduct,
    deleteAllProduct} from '../controllers/products.controller.js'
    
    import { existIdProduct } from '../helpers/db-validator.js';
    import { middlewareAuth } from '../middlewares/middlewaresProducts.js';
    import  { validateInputs } from '../middlewares/validateInputs.js';

import  uploader from '../services/Upload.js';
const router = express.Router();

//Get all Products
router.get('/', [
    check('page', 'Must be a numeric value').optional().isNumeric(),
    check('from', 'Must be a numeric value').optional().isNumeric(),
    validateInputs,
], getProducts)

//Get Product by Id
router.get('/:id', [
    // check('id', 'ID Product is requerid').not().isEmpty().isMongoId().withMessage("Id incorrect"),
    check('id', 'ID Product is requerid').not().isEmpty(),
    validateInputs,
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
    middlewareAuth,
    // check('id').custom(existIdProduct),
    check('id', 'ID Product is requerid').not().isEmpty(),
    check('name', 'Name is requerid').optional().not().isEmpty(),
    check('price', 'Price is requerid').optional().isNumeric().withMessage('Price Must be a numeric value'),
    check('image', 'Image is requerid').optional(),
    check('description', 'Name is requerid').optional(),
    check('stock', 'Stock is requerid').optional().isNumeric().withMessage('Price Must be a numeric value'),
    validateInputs
]
, putProduct)

//Deleted All Products
router.delete('/all', deleteAllProduct)

//Delete Product by id 
router.delete('/:id' ,[
    middlewareAuth,
    // check('id').custom(existIdProduct),
    check('id', 'ID Product is requerid').not().isEmpty(),
],  deleteProduct);

export default router;
