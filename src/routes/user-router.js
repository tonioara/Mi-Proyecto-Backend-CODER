

import { Router } from "express";
import UserManager from "../managers/UserManagers.js"; 

const router = Router();

const RUTA_DATOS = './data/users.json'; 
const manager = new UserManager(RUTA_DATOS);

router.post('/', async (req, res) => {
 try {
  const user = await manager.createUser(req.body); 
  res.redirect(`/home/${user.id}`);
  } catch (error) {
  console.error("Error al registrar usuario:", error);
  res.status(400).json({ error: error.message });
 }
});



export default router;