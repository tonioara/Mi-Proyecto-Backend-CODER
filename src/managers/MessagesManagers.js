import fs from 'fs';
import { v4 as uuidv4 } from "uuid"; 

class MessagesManager {
    constructor(ruta) {
        this.ruta = ruta;
    }
    getAllMessages = async () => {
        try {
            if (fs.existsSync(this.ruta)) {
                const data = await fs.promises.readFile(this.ruta, 'utf-8');
                return JSON.parse(data);
            } else {
                return [];
            }
        } catch (error) {
            console.error("Error al leer el historial de mensajes:", error);
            throw new Error("No se pudo obtener el historial.");
        }
    }
    saveMessage = async (user, message) => {
        try {
            if (!user || !message) {
                throw new Error("El usuario y el mensaje son obligatorios.");
            }

            const messages = await this.getAllMessages();
            const newMessage = {
                id: uuidv4(), 
                user, 
                message,
                time: new Date().toLocaleString()
            };
            
            messages.push(newMessage);
            
            await fs.promises.writeFile(this.ruta, JSON.stringify(messages, null, 2));
            
            return newMessage;
        } catch (error) {
            console.error("Error al guardar el mensaje:", error);
            throw error;
        }
    }
    deleteMessageById = async (id) => {
        try {
            const messages = await this.getAllMessages();
            const initialLength = messages.length;
            
            
            const filteredMessages = messages.filter(m => m.id !== id);
            
            if (initialLength === filteredMessages.length) {
                throw new Error(`Mensaje con ID: ${id} no encontrado.`);
            }

            
            await fs.promises.writeFile(this.ruta, JSON.stringify(filteredMessages, null, 2));
            
            return `Mensaje con ID: ${id} eliminado exitosamente.`;
        } catch (error) {
            console.error("Error al borrar el mensaje por ID:", error);
            throw error;
        }
    }
    clearAllMessages = async () => {
        try {
            
            await fs.promises.writeFile(this.ruta, JSON.stringify([]));
            console.log("Historial de chat borrado.");
            return "Historial de chat borrado exitosamente.";
        } catch (error) {
            console.error("Error al limpiar el chat:", error);
            throw new Error("No se pudo limpiar el historial.");
        }
    }
}
export const ChatManager = new MessagesManager("./data/chat.json");