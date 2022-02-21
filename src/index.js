const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');

const productsRouter = require('./routers/products.router');

const app = express();

app.use(express.urlencoded({extended:true})) //Middleware para leer queries del url
app.use(express.json()) //Middleware para leer archivos JSON
app.use(express.static(path.join(__dirname + '/public'))) //Middleware para crear un espacio estatico

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname+'/views');
app.set('view engine', 'handlebars');

//Plantillas pug
// app.set('views', __dirname+'/views-pug');
// app.set('view engine', 'pug');

//Plantillas ejs
// app.set('views', __dirname+'/views-ejs');
// app.set('view engine', 'ejs');


//Rutas 
app.use('/api/products', productsRouter)

//Settings
app.set('port', process.env.PORT || 5000)

//Listenning the server
const server = app.listen(app.get('port'), () => {
    console.log(`Servidor http escuchando en el puesto ${server.address().port}`);
})

server.on("error", error => console.log(`Error en servidor ${error}`))