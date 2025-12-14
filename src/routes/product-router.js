import {Router } from 'express';
import { ProductManagerInstancia } from '../managers/ProductManager.js';
import { productValidator } from '../middlewares/product-validator.js';
import { upload } from '../middlewares/multer.js';
import { socketServer } from '../server.js';


const productRouter = Router();


productRouter.get('/',async(req, res) => {
   
    try {
        const productos = await ProductManagerInstancia.getAllProductos();
        res.json(productos);


    } catch (error) {
        res.status(500).send({error: "Error al leer los productos"});
    }
})
productRouter.get('/:pid',async(req, res) => {
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
productRouter.post('/', async (req, res) => {
    try {
        const data = req.body;

        // Adaptamos los datos del formulario (Español) al Modelo del Manager (Inglés)
        // Si usas Postman enviando JSON directo con las keys en inglés, esto no rompe nada.
        const nuevoProducto = {
            title: data.nombre || data.title,
            description: data.descripcion || data.description,
            code: data.code || `CODE-${Date.now()}`,
            price: parseFloat(data.precio || data.price),
            stock: parseInt(data.stock || data.stock),
            category: data.sector || data.category,
            thumbnails: []
        };

        const productoCreado = await ProductManagerInstancia.create(nuevoProducto);

        // --- SOCKET.IO: Emitir evento a todos los clientes ---
        const productosActualizados = await ProductManagerInstancia.getAllProductos();
        socketServer.emit('arrayProductos', productosActualizados);

        // Si la petición viene de un formulario HTML (navegador), redirigimos
        // Si viene de Postman (JSON), devolvemos JSON
        if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
            res.redirect('/realtimeproducts');
        } else {
            res.status(201).json(productoCreado);
        }

    } catch (error) {
        res.status(400).send({ error: error.message || "Error al crear el producto" });
    }
})


/*Prueba de multer  */
productRouter.post('/test-multer',upload.single('image') , async(req, res) => {
    const nuevoProducto = {...req.body, image: req.file.path};
    try {

        const productoCreado = await ProductManagerInstancia.create(nuevoProducto);
        res.status(201).json(productoCreado);
    } catch (error) {
        res.status(400).send({error: error.message || "Error al crear el producto"});
    }       
})
/** Fin prueba de multer */
productRouter.put('/:pid',async(req, res) => {
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
productRouter.delete('/:pid',async(req, res) => {
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

export default productRouter;