import express from 'express';
import cluster from 'cluster';
import os from 'os'
import cors from 'cors'
import dotenv from 'dotenv';
import {Server as SocketIO} from 'socket.io'
import handlebars from 'express-handlebars'
import compression from 'compression';
import log4js from 'log4js'

import _yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import productsRouter from './routers/products.router.js';
import cartRouter from './routers/cart.router.js';
import login from './routers/login.router.js';
import productTestRouter from './routers/productsTest.router.js';
import infoRouter from './routers/info.router.js';
import randomsRouter from './routers/randoms.router.js';
import testForeverRouter from './routers/testForever.router.js'

import Socket from './sockets/socket.js'

import { fileURLToPath } from 'url'
import path, { dirname } from 'path'

//Para leer variables de entorno
dotenv.config();

//Revisamos cuantos cores tiene nuestro cpu
const numbersCpu = os.cpus().length;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

//Middleware
app.use(express.urlencoded({extended:false})) //Middleware para leer queries del url
app.use(express.json()) //Middleware para leer archivos JSON
app.use(express.static(path.join(__dirname + '/public'))) //Middleware para crear un espacio estatico
app.use(cors());
app.use(compression())
// app.engine('handlebars', handlebars.engine());
// app.set('views', __dirname+'/views');
// app.set('view engine', 'handlebars');

const yargs = _yargs(hideBin(process.argv));
const argv = yargs
        .option('port', { type: 'number'})
        .alias('p', 'port')
        .default('port', 4000)
          .argv

const PORT = argv.port;

//Rutas 
app.use('/autentication', login);
app.use('/api/products', productsRouter)
app.use('/api/cart', cartRouter)

//Ruta para pruebas
app.use('/api/products-test', productTestRouter)
app.use('/api/info', infoRouter)

    
app.use('/api', randomsRouter)
app.use('/test-forever', testForeverRouter)

//Settings
app.set('port', PORT)


// if (cluster.isPrimary) {
//   //Creamos los clones de ese proceso principal 
//   for (let i = 0; i < numbersCpu; i++) {
//     cluster.fork();
//   }

//   cluster.on('exit', (worker, code, signal) => {
//     console.log(`The Process ${worker.process.pid} dead`);
//     cluster.fork();
//   })
// }else {
//   app.listen(app.get('port'), () => {
//     console.log(`Running process ${process.pid} on port ${PORT}`);
//   })
// }

//Listenning the server
const server = app.listen(app.get('port'), () => {
    console.log(`Servidor http escuchando en el puesto ${server.address().port} con proceso ${process.pid}`);
})

// server.on("error", error => console.log(`Error en servidor ${error}`))

// //Sockets
// const io = new SocketIO(server);
// Socket(io)