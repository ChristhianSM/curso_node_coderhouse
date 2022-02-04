const express = require('express');
const path = require('path');
const { Contenedor } = require('../models/UserManagerProducts')

const app = express();

//Settings
app.set('port', 5000)
const contenedor = new Contenedor(path.join(__dirname + '/../files/products.txt'));

//Routes
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

//Listenning the server
const server = app.listen(app.get('port'), () => {
    console.log(`Servidor http escuchando en el puesto ${server.address().port}`);
})

server.on("error", error => console.log(`Error en servidor ${error}`))