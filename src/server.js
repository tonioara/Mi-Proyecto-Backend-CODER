import express from 'express';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
import path from 'path'; 
import { __dirname } from './utils.js';
import viewsRouter from './routes/views-router.js';
import productRouter from './routes/product-router.js'; 
import cartsRouter from './routes/carts-router.js'; 
import userRouter from './routes/user-router.js'; 


import { ProductManagerInstancia } from './managers/ProductManager.js'; 
import { ChatManager } from './managers/MessagesManagers.js';

const server = express();
const port = 8080;


server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(express.static(path.join(__dirname, 'public'))); 
server.use(express.static(`${process.cwd()}/src/public`)); 

server.engine('handlebars', handlebars.engine());
server.set('view engine', 'handlebars');
server.set('views', path.join(__dirname, 'views'));


server.use('/api/productos', productRouter);
server.use('/api/carts', cartsRouter);
server.use('/api/users', userRouter);
server.use('/', viewsRouter);



const httpServer = server.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});


export const socketServer = new Server(httpServer);


const configureChatSocket = (io) => { 
  io.on('connection', async (socket) => {
     console.log(`Nuevo usuario conectado al chat: ${socket.id}`);

 
       const messages = await ChatManager.getAllMessages();
       socket.emit('chat:loadHistory', messages);

       socket.on('user:connected', (username) => {
       console.log(`Usuario "${username}" conectado para chatear.`);


       socket.broadcast.emit('user:newConnection', username); 
});


       socket.on('chat:message', async (data) => {

       const savedMessage = await ChatManager.saveMessage(data.user, data.message);


       io.emit('chat:message', savedMessage); 
    }
    );

      socket.on('chat:typing', (username) => {
      
      socket.broadcast.emit('chat:typing', username);
     });

      socket.on('disconnect', () => {
       console.log(`Usuario desconectado del chat: ${socket.id}`);
       });
 });
};


 configureChatSocket(socketServer);




socketServer.on('connection', async (socket) => {
    console.log(`Nuevo cliente conectado: ${socket.id}`);
    
    
    const initialProducts = await ProductManagerInstancia.getAllProductos();
    socket.emit('arrayProductos', initialProducts); 

    
    socket.on('eliminar-producto', async (productId) => {
        try {
            await ProductManagerInstancia.borrar(String(productId));
            
            
            const updatedProducts = await ProductManagerInstancia.getAllProductos();
            socketServer.emit('arrayProductos', updatedProducts); 
        } catch (error) {
            console.error("Error al eliminar por socket:", error);
        }
    });

    
});