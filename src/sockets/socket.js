import { productDao } from '../daos/index.js'
import Message from '../models/UserManagerChat.js';
import optionsSqlite3 from '../database/mysqlite3/options/slqiteconfig.js';

const chat = new Message(optionsSqlite3, "messages", "users");

export default (io) => {
    io.on("connection", async (socket) => {
      console.log("nuevo socket connectado:", socket.id);
      //Para mostrar los productos apenas inicie 
        const results = await productDao.getAll();
        io.emit('products' ,results.payload.products)

        //Para mostrar los mensajes apenas inicie
        const messages = await chat.getAllMessages(); 
        io.emit('data-messages', messages.results);

        const users = await chat.getAllUsers();
        io.emit('users-login', users.results)

        //Recibimos al usuario logeado 
        socket.on('user', async (user) => {
            const results  = await chat.saveUsers(user);
            const users = await chat.getAllUsers();
            socket.emit('users-login', users.payload)
        })

        socket.on('sendProduct', async (data) => {
            await productDao.save(data);
            const results = await productDao.getAll();
            io.emit('products' , results.payload.products)
        })

        socket.on('message', async (data) => {
            console.log(data)
            const resultado = await chat.save(data);
            const messages = await chat.getAllMessages();
            io.emit('data-messages', messages.results);
        })

        socket.on('deleteProduct', async (data) => {
            const results = await productDao.getAll();
            io.emit('products' ,results.payload.products)
        })
    });
  };


