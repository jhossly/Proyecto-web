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

export { register, login };
