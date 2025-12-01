import { Router } from "express";
import { CartsManagerInstancia } from "../managers/CartsManagers.js";


const cartsRouter = Router();

cartsRouter.post('/',async(req, res) => {
    try {
        const nuevoCarrito = await CartsManagerInstancia.createCart();
        res.status(201).json(nuevoCarrito);
    } catch (error) {
        console.error("Fallo detallado al crear carrito:", error);
        res.status(500).send({error: "Error al crear el carrito"});
    }
});

cartsRouter.get('/:cid',async(req, res) => {
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
cartsRouter.post('/:cid/product/:pid',async(req, res) => {
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
export default cartsRouter;