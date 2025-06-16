import express from 'express';
import { register, login, obtenerUsuarioAutenticado } from '../controllers/userController.js';
import { getAllUsers } from '../controllers/userController.js';
import { verifyToken,verifyAdmin } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/all', verifyToken, verifyAdmin, getAllUsers); // Solo admin puede ver todos los usuarios
router.get('/me',verifyToken,obtenerUsuarioAutenticado);
router.get('/usuarios', getAllUsers);
export default router;
