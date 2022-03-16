import express from 'express';
import {Server as SocketIO} from 'socket.io'
import handlebars from 'express-handlebars'

import productsRouter from './routers/products.router.js';
import cartRouter from './routers/cart.router.js';

import { Contenedor } from'./models/UserManagerProducts.js';
import Message  from'./models/UserManagerChat.js';

import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import options from './database/mysql/options/mysqlconfig.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.urlencoded({extended:true})) //Middleware para leer queries del url
app.use(express.json()) //Middleware para leer archivos JSON
console.log(__dirname + '/public')
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


//Instanciamos la clase Contenedor 
const contenedor = new Contenedor(options, "products");

//Sockets
const chat = new Message(path.join(__dirname + '/files/messages.txt'));

const io = new SocketIO(server);
io.on('connection', async (socket) => {
    //Para mostrar los productos apenas inicie 
    const results = await contenedor.getAll();
    io.emit('products' ,results.payload.products)

    //Para mostrar los mensajes apenas inicie
    const messages = await chat.getAll(); 
    io.emit('data-messages', messages.payload);

    const users = await chat.getAllUsers();
    io.emit('users-login', users.payload)

    //Recibimos al usuario logeado 
    socket.on('user', async (user) => {
        await chat.saveUsers(user);
        const users = await chat.getAllUsers();
        socket.emit('users-login', users.payload)
    })

    socket.on('sendProduct', async (data) => {
        await contenedor.save(data);
        const results = await contenedor.getAll();
        io.emit('products' , results.payload.products)
    })

    socket.on('message', async (data) => {
        await chat.save(data);
        const messages = await chat.getAll();

        io.emit('data-messages', messages.payload);
    })

    socket.on('deleteProduct', async (data) => {
        const results = await contenedor.getAll();
        io.emit('products' ,results.payload.products)
    })
})