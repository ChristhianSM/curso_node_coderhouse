import express from 'express';
import dotenv from 'dotenv';
import {Server as SocketIO} from 'socket.io'
import handlebars from 'express-handlebars'

import productsRouter from './routers/products.router.js';
import cartRouter from './routers/cart.router.js';

import Socket from './sockets/socket.js'

import { fileURLToPath } from 'url'
import path, { dirname } from 'path'

//Para leer variables de entorno
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.urlencoded({extended:true})) //Middleware para leer queries del url
app.use(express.json()) //Middleware para leer archivos JSON
app.use(express.static(path.join(__dirname + '/public'))) //Middleware para crear un espacio estatico

// app.engine('handlebars', handlebars.engine());
// app.set('views', __dirname+'/views');
// app.set('view engine', 'handlebars');

//Rutas 
app.use('/api/products', productsRouter)
app.use('/api/cart', cartRouter)

//Settings
app.set('port', process.env.PORT || 5000)

//Listenning the server
const server = app.listen(app.get('port'), () => {
    console.log(`Servidor http escuchando en el puesto ${server.address().port}`);
})

server.on("error", error => console.log(`Error en servidor ${error}`))

//Sockets
const io = new SocketIO(server);
Socket(io)