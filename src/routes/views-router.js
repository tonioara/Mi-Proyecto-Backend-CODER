import { Router } from "express";
import UserManager from "../managers/UserManagers.js";
import { ProductManagerInstancia } from '../managers/ProductManager.js';


const router = Router();

const RUTA_DATOS = './data/users.json';
const UserManagerInstancia = new UserManager(RUTA_DATOS);

router.get('/register', (req, res) => {
    res.render('form', {title: "Página de Inicio", welcomeMessage: "¡Bienvenido a nuestra aplicación web!"});

})
router.get('/realtimeproducts', async (req, res) => {
    
    const products = await ProductManagerInstancia.getAllProductos(); 
    res.render('realTimeProducts', { 
        title: 'Productos en Tiempo Real'
        , products: products

    });
});
router.get('/home', async (req, res) => {
   const products = await ProductManagerInstancia.getAllProductos();
     res.render('home', {
        title: 'Página de Inicio Estática',
        products: products  });  
});

router.get('/home/:id',async (req, res) => {
    try {
        const {id} = req.params;
        const user = await UserManagerInstancia.getUserById(id);
         res.render('home', {user});
    } catch (error) {
        res.render('error', {message: "Error al cargar el usuario"});

    }
}); 

router.get('/chat', (req, res) => {
    res.render('chat', {title: "Chat en Tiempo Real"});
}); 



export default router;
