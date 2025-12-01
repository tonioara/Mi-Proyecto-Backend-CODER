
import express from 'express';
import productRouter from './routes/product-router.js';
import cartsRouter from './routes/carts-router.js';

const server = express();
const port= 8080;
 
server.use(express.json());
server.use(express.urlencoded({extended:true}));
server.use(express.static(`${process.cwd()}/src/public`));

server.use('/api/productos', productRouter);
server.use('/api/carts', cartsRouter);

server.get('/', (req, res) => {
    res.send('Servidor Express en funcionamiento');
});





































server.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});