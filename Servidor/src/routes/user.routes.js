const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middlewares'); // Middleware para verificar el token

// Ruta para registrar un usuario
router.post('/register', UserController.registerUser);

// Ruta para iniciar sesión
router.post('/login', UserController.loginUser);

router.get('/buscar', verifyToken, UserController.getUsersByFiltroParcial);
// Ruta para obtener un usuario por ID (requiere autenticación)
router.get('/:userId', verifyToken, UserController.getUserById);

// Ruta para actualizar un usuario (requiere autenticación)
router.put('/:userId', verifyToken, UserController.updateUser);

// Ruta para eliminar un usuario (requiere autenticación y puede ser administrado por el admin)
router.delete('/:userId', verifyToken, UserController.deleteUser);

// Ruta para obtener todos los usuarios (requiere ser admin)
router.get('/', verifyToken, UserController.getAllUsers);

// Actualizar descuentos de un usuario
router.put('/:userId/descuentos', verifyToken, UserController.updateUserDiscounts);

router.post('/forgot-password', UserController.forgotPassword);
router.post('/reset-password/:token', UserController.resetPassword);

module.exports = router;
