const express = require('express');
const { Contenedor } = require('./models/UserManagerProducts')

const PORT = 8080;

const app = express();

const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puesto ${server.address().port}`);
})

const contenedor = new Contenedor("./files/products.txt");

app.get('/', (req, res) => {
    res.send({mensaje: 'Hola Mundo'})
})

app.get('/productos', async (req, res) => {
    const productos = await contenedor.getAll();
    res.send(productos.payload)
})

app.get('/productoRandom', async (req, res) => {
    const { payload } = await contenedor.getAll();

    const quantityProducts = payload.length;
    const random = Math.floor((Math.random() * quantityProducts));
    res.send(payload[random])
})

server.on("error", error => console.log(`Error en servidor ${error}`))