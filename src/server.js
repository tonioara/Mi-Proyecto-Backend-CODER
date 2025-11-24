
import express from 'express';
import { ProductManagerInstancia } from './managers/ProductManager.js';
import { CartsManagerInstancia } from './managers/CartsManagers.js';


const server = express();
const port= 8080;
 
server.use(express.json());

server.get('/', (req, res) => {
    res.send('Servidor Express en funcionamiento');
});

server.get('/api/productos',async(req, res) => {
   
    try {
        const productos = await ProductManagerInstancia.getAllProductos();
        res.json(productos);


    } catch (error) {
        res.status(500).send({error: "Error al leer los productos"});
    }
})
server.get('/api/productos/:pid',async(req, res) => {
    const id = req.params.pid;
    try {
        const producto = await ProductManagerInstancia.getProductosById(id);        
        if (!producto) {
            return  res.status(404).send({error: "Producto no encontrado"});
        }           
        res.json(producto);
    } catch (error) {
        res.status(500).send({error: "Error al leer el producto"});
    }   
})
server.post('/api/productos',async(req, res) => {
    const nuevoProducto = req.body;
    try {
        const productoCreado = await ProductManagerInstancia.create(nuevoProducto);
        res.status(201).json(productoCreado);
    } catch (error) {
        res.status(400).send({error: error.message || "Error al crear el producto"});
    }       
})
server.put('/api/productos/:pid',async(req, res) => {
    const id = req.params.pid;       
    const datosActualizados = req.body;     
    try {
        const productoActualizado = await ProductManagerInstancia.update(datosActualizados, id);        
        if (!productoActualizado) {
            return res.status(404).send({error: "Producto no encontrado"});
        }   
        res.json(productoActualizado);
    } catch (error) {
        res.status(500).send({error: "Error al actualizar el producto"});
    }   
})
server.delete('/api/productos/:pid',async(req, res) => {
    const id = req.params.pid;   
    try {
        const mensaje = await ProductManagerInstancia.borrar(id);
        if (!mensaje) {
            return res.status(404).send({error: "Producto no encontrado"});
        }
        res.json({mensaje});
    } catch (error) {
        res.status(500).send({error: "Error al eliminar el producto"});
    }       
})
/**
 * 
 * 
 */

server.post('/api/carts',async(req, res) => {
    try {
        const nuevoCarrito = await CartsManagerInstancia.createCart();
        res.status(201).json(nuevoCarrito);
    } catch (error) {
        console.error("Fallo detallado al crear carrito:", error);
        res.status(500).send({error: "Error al crear el carrito"});
    }
});

server.get('/api/carts/:cid',async(req, res) => {
    const cartId = req.params.cid;
    try {
        const carrito = await CartsManagerInstancia.getCartById(cartId);
        if (!carrito) {
            return res.status(404).send({error: "Carrito no encontrado"});
        }
        res.json(carrito.products);
    } catch (error) {
        res.status(500).send({error: "Error al leer el carrito"});
    }
});  
server.post('/api/carts/:cid/product/:pid',async(req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    try {
        const resultado = await CartsManagerInstancia.addProductToCart(cartId, productId);
        if (!resultado) {
            return res.status(404).send({error: "Carrito o producto no encontrado"});
        }   
        res.json(resultado);
    } catch (error) {
        res.status(500).send({error: "Error al agregar el producto al carrito"});
    }   
});


server.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});