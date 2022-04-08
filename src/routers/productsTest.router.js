import express from 'express';

import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { productTestDao } from '../daos/index.js'
const router = express.Router();

router.post('/popular', (req, res) => {
    const cant = (req.query.cant);
    const products = productTestDao.popular(cant);
    res.json(products)
})

router.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname + "/../public/productsTest.html"))
})

router.get('/all', async (req, res) => {
    const product = await productTestDao.getAllProducts();
    res.json(product)
})

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const product = await productTestDao.getById(id);
    res.json(product)
})

router.post('/', async (req, res) => {
    const body = req.body;
    const product = await productTestDao.save(body);
    res.json(product)
})

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const body = req.body;
    const product = await productTestDao.updateProduct(id, body);
    res.json(product)
})

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    const product = await productTestDao.deleteById(id);
    res.json(product)
})


export default router;