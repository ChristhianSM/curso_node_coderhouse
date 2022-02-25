const express = require('express');
const SocketIO = require('socket.io');
const handlebars = require('express-handlebars');
const path = require('path');

const productsRouter = require('./routers/products.router');
const { Contenedor } = require('./models/UserManagerProducts');

const app = express();

app.use(express.urlencoded({extended:true})) //Middleware para leer queries del url
app.use(express.json()) //Middleware para leer archivos JSON
app.use(express.static(path.join(__dirname + '/public'))) //Middleware para crear un espacio estatico

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname+'/views');
app.set('view engine', 'handlebars');

//Rutas 
app.use('/api/products', productsRouter)

//Settings
app.set('port', process.env.PORT || 5000)

//Listenning the server
const server = app.listen(app.get('port'), () => {
    console.log(`Servidor http escuchando en el puesto ${server.address().port}`);
})

server.on("error", error => console.log(`Error en servidor ${error}`))


//Instanciamos la clase Contenedor 
const contenedor = new Contenedor(path.join(__dirname + '/files/products.txt'));

//Sockets
const io = SocketIO(server);
io.on('connection', async (socket) => {
    console.log("User Nuevo");
    const products = await contenedor.getAll();
    socket.emit('products' ,products.payload)

    socket.on('sendProduct', async (data) => {
        await contenedor.save(data);
        const products = await contenedor.getAll();
        socket.emit('products' ,products.payload)
    })
})