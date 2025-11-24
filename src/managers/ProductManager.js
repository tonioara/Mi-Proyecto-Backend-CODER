
import fs from 'fs';
import { v4 as uuidv4 } from "uuid";

class ProductManager {
    constructor(ruta) {
        this.ruta = ruta;
        console.log(`ProductManager está usando la ruta: ${this.ruta}`);
    }
  
getAllProductos = async () => {
    try{
        if (fs.existsSync(this.ruta)) {
            const data = await fs.promises.readFile(this.ruta, 'utf-8');
            const productos = JSON.parse(data);
            return productos;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error al leer el archivo:", error);
    
    }

}
getProductosById = async (id) => {
    try{
        const productos = await this.getAllProductos();
        const producto = productos.find(p => p.id === id);
        if (!producto) {
            console.error("Producto no encontrado");
            return null;
        }

        return producto;    

    } catch (error) {
        console.error("Error al leer el archivo:", error);
    
    }

}
create = async (obj) => {
    try{
        const productos = await this.getAllProductos();
        const requiredFields = ['title', 'description', 'code', 'price', 'stock', 'category'];
        const missingFields = requiredFields.filter(field => !obj[field]);
        if (missingFields.length > 0) {
            throw new Error(`Faltan los siguientes campos obligatorios: ${missingFields.join(', ')}`);
        }   
        const nuevoProducto = { 
            id: uuidv4(),
             ...obj
             };
        productos.push(nuevoProducto);
        await fs.promises.writeFile(this.ruta, JSON.stringify(productos));
        return nuevoProducto;
    } catch (error) {
        console.error("Error al leer el archivo:", error);
        throw error
    
    }

}
update = async (obj,id) => {
    try{
      const productos = await this.getAllProductos();
      let productoExistente = await this.getProductosById(id);
        if (!productoExistente) {   
            console.error("Producto no encontrado");
            return null;
        }   
        productoExistente = { ...productoExistente, ...obj };
        const index = productos.findIndex(p => p.id === id);
        productos[index] = productoExistente;
        await fs.promises.writeFile(this.ruta, JSON.stringify(productos));
        return productoExistente;

    } catch (error) {
        console.error("Error al leer el archivo:", error);
    
    }

}
borrar = async (id) => {
    try{
        const productos = await this.getAllProductos();
        const product= await this.getProductosById(id);
        if (!product) {   
            console.error("Producto no encontrado");
            return null;
        }
        const productosFiltrados = productos.filter(p => p.id !== id);
        await fs.promises.writeFile(this.ruta, JSON.stringify(productosFiltrados));
        return `Producto con id: ${product.id} eliminado`
    } catch (error) {
        console.error("Error al leer el archivo:", error);
    
    }

}
}
export const ProductManagerInstancia = new ProductManager("./data/products.json");