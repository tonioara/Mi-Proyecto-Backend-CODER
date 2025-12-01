import {Router } from 'express';
import { ProductManagerInstancia } from '../managers/ProductManager.js';
import { productValidator } from '../middlewares/product-validator.js';
import { upload } from '../middlewares/multer.js';

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
productRouter.post('/',productValidator , async(req, res) => {
    const nuevoProducto = req.body;
    try {
        const productoCreado = await ProductManagerInstancia.create(nuevoProducto);
        res.status(201).json(productoCreado);
    } catch (error) {
        res.status(400).send({error: error.message || "Error al crear el producto"});
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