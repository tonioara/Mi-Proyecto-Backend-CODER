import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

class UserManager {
    constructor(ruta) {
        this.ruta = ruta;
        console.log(`UsersManager está usando la ruta: ${this.ruta}`);
    } 

    writeFile = async (data) => {
      try {
        await fs.promises.writeFile(this.ruta, JSON.stringify(data, null, 2));  

      } catch (error) {
        console.error("Error al escribir el archivo:", error);
        throw new Error("Error al escribir el archivo");
      } 


    }
    getAllUsers = async () => {
        try {
            if (fs.existsSync(this.ruta)) {   
                const data = await fs.promises.readFile(this.ruta, 'utf-8');    
                const users = JSON.parse(data);
                return users;
            } else {
                return [];
            } 
        } catch (error) {
            console.error("Error al leer el archivo:", error);
        }   
    }

    createUser = async (userData) => {  
        try {
            const users = await this.getAllUsers();
            const hashedPassword = await bcrypt.hash(userData.password, 10);  
            const nuevoUsuario = {
                id: uuidv4(),
                ...userData,
                password: hashedPassword  
            };  
            users.push(nuevoUsuario);
            await fs.promises.writeFile(this.ruta, JSON.stringify(users));
            return nuevoUsuario;
        } catch (error) {
            console.error("Error al leer el archivo:", error);
            throw error;
        } 
    }
    registerUser = async (userData) => {
        try {
            const users = await this.getAllUsers(); 
            const existingUser = users.find(u => u.username === userData.username); 
            if (existingUser) {
                throw new Error("El nombre de usuario ya existe");
            }
            const newUser = await this.createUser(userData); 
            return newUser;
        } catch (error) {
            console.error("Error al registrar el usuario:", error);
            throw error;
        }
    }
    loginUser = async (username, password) => {
        try {
            const users = await this.getAllUsers();     
            const user = users.find(u => u.username === username);
            if (!user) {
                throw new Error("Usuario no encontrado");
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error("Contraseña incorrecta");
            }       
            return user;
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            throw error;
        }   
    }   
    
    getUserById = async (id) => {
        try { 
            const users = await this.getAllUsers(); 
            const user = users.find(u => u.id === id);  
            if (!user) {
                console.error("Usuario no encontrado");
                return null;
            }   
            return user;
        } catch (error) {
            console.error("Error al leer el archivo:", error);
        } 
    }

} 

export default UserManager;