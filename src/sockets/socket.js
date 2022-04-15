import { productDao, messagesDao } from '../daos/index.js'
// import Message from '../models/UserManagerChat.js';
// import optionsSqlite3 from '../database/mysqlite3/options/slqiteconfig.js';

// const chat = new Message(optionsSqlite3, "messages", "users");

export default (io) => {
    io.on("connection", async (socket) => {
      console.log("nuevo socket connectado:", socket.id);
      //Para mostrar los productos apenas inicie 
        const results = await productDao.getAllProducts();
        io.emit('products' ,results.payload.products)

        //Para mostrar los mensajes apenas inicie
        const messages = await messagesDao.getAllMessages();
        io.emit('data-messages', messages.payload);

        const users = await messagesDao.getAllUsers();
        io.emit('users-login', users.payload)

        //Recibimos al usuario logeado 
        socket.on('user', async (user) => {
            await messagesDao.saveUsers(user);
            const users = await messagesDao.getAllUsers();
            socket.emit('users-login', users.payload)
        })

        socket.on('sendProduct', async (data) => {
            await productDao.save(data);
            const results = await productDao.getAllProducts();
            io.emit('products' , results.payload.products)
        })

        socket.on('message', async (data) => {
            await messagesDao.save(data);
            const messages = await messagesDao.getAllMessages();
            io.emit('data-messages', messages.payload);
        })

        socket.on('deleteProduct', async (data) => {
            const results = await productDao.getAllProducts();
            io.emit('products' ,results.payload.products)
        })
    });
  };


