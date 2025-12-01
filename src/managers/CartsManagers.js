import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

class CartsManager {
    constructor(ruta) {
        this.ruta = ruta;
        console.log(`ProductManager está usando la ruta: ${this.ruta}`);
    }   

    writeFile = async (data) => {
      try {
        await fs.promises.writeFile(this.ruta, JSON.stringify(data, null, 2));
      } catch (error) {
        console.error("Error al escribir el archivo:", error);
        throw new Error("Error al escribir el archivo");
      }
       
    }

    getAllCarts = async () => {
        try {
            if (fs.existsSync(this.ruta)) {   
                const data = await fs.promises.readFile(this.ruta, 'utf-8');
                const carts = JSON.parse(data);
                return carts;
            } else {
                return [];
            }   
        } catch (error) {
            console.error("Error al leer el archivo:", error);
        } 
    }

    createCart = async () => {  
        try {
            const carts = await this.getAllCarts();
            const nuevoCarrito = {  
                id: uuidv4(),
                products: []
            };  
            carts.push(nuevoCarrito);
            await fs.promises.writeFile(this.ruta, JSON.stringify(carts));
            return nuevoCarrito;
        } catch (error) {
            console.error("Error al leer el archivo:", error);
            throw error;
        }   
    }
    getCartById = async (id) => {
        try {
            const carts = await this.getAllCarts(); 
            const cart = carts.find(c => c.id === id);
            if (!cart) {
                console.error("Carrito no encontrado");
                return null;
            }
            return cart;
        } catch (error) {
            console.error("Error al leer el archivo:", error);
        } 
    }
    addProductToCart = async (cartId, productId) => {
        try {
            const carts = await this.getAllCarts();     
            const cartIndex = carts.findIndex(c => c.id === cartId);
            if (cartIndex === -1) {
                console.error("Carrito no encontrado");
                return null;  
            }   
            const productInCartIndex = carts[cartIndex].products.findIndex(p => p.productId === productId);   
            if (productInCartIndex === -1) {
                carts[cartIndex].products.push({ productId: productId, quantity: 1 });
            } else {
                carts[cartIndex].products[productInCartIndex].quantity += 1;
            } 
            await this.writeFile(carts);
            return carts[cartIndex];
        } catch (error) {
            console.error("Error al leer el archivo:", error);
            throw error;
        }
    }


}   
export const CartsManagerInstancia = new CartsManager("./data/carts.json");
