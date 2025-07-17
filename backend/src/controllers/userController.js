// File: backend/src/controllers/userController.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// REGISTRO
const register = async (req, res) => {
  const { nombre, correo, contraseña } = req.body;

  try {
    const usuarioExistente = await User.findOne({ correo });
    if (usuarioExistente) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    const salt = await bcrypt.genSalt(10);
    const contraseñaEncriptada = await bcrypt.hash(contraseña, salt);

    const user = await User.create({
      nombre,
      correo,
      contraseña: contraseñaEncriptada,
      role: correo === 'admin@golosito.com' ? 'admin' : 'user'
    });

    res.status(201).json({
      message: 'Usuario creado',
      user: {
        _id: user._id,
        nombre: user.nombre,
        correo: user.correo,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar', error: error.message });
  }
};

// LOGIN
const login = async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    const user = await User.findOne({ correo }).select('+contraseña');
    if (!user) return res.status(401).json({ message: 'Credenciales incorrectas' });

    const contraseñaValida = await bcrypt.compare(contraseña, user.contraseña);
    if (!contraseñaValida) return res.status(401).json({ message: 'Credenciales incorrectas' });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      'secreto_super_secreto',
      { expiresIn: '1h' }
    );
      
        res.status(200).json({
      message: 'Login exitoso',
      token,
      user: {
        _id: user._id,
        nombre: user.nombre,
        correo: user.correo,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-contraseña'); // No enviamos la contraseña
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};
// Obtener usuario autenticado
const obtenerUsuarioAutenticado = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-contraseña'); // sin contraseña
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    res.json({ usuario: user });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
};
 // Actualizar perfil de usuario
export const actualizarPerfilUsuario = async (req, res) => {
  try {
    const userId = req.userId;
    const { nombre, correo, telefono, direcciones } = req.body;

    // Verificar si el correo ya existe en otro usuario
    if (correo) {
      const usuarioConEmail = await User.findOne({ 
        correo, 
        _id: { $ne: userId } 
      });
      
      if (usuarioConEmail) {
        return res.status(400).json({ 
          mensaje: 'El correo ya está en uso por otro usuario' 
        });
      }
    }

    const usuarioActualizado = await User.findByIdAndUpdate(
      userId,
      { nombre, correo, telefono, direcciones },
      { new: true, runValidators: true }
    ).select('-contraseña');

    res.json({ 
      mensaje: 'Perfil actualizado correctamente',
      usuario: usuarioActualizado 
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ mensaje: 'Error al actualizar perfil' });
  }
};

// Desactivar cuenta
export const desactivarCuenta = async (req, res) => {
  try {
    const userId = req.userId;
    
    const usuarioActualizado = await User.findByIdAndUpdate(
      userId,
      { activo: false },
      { new: true }
    ).select('-contraseña');

    res.json({ 
      mensaje: 'Cuenta desactivada correctamente',
      usuario: usuarioActualizado
    });
  } catch (error) {
    console.error('Error al desactivar cuenta:', error);
    res.status(500).json({ mensaje: 'Error al desactivar cuenta' });
  }
};
export const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id); 
  res.json({ usuario: user });
};
export { register, login, obtenerUsuarioAutenticado };


