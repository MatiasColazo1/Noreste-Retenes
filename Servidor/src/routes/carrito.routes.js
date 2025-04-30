const express = require('express');
const router = express.Router();
const carritoController = require('../controllers/carrito.controller');
const { verifyToken } = require('../middlewares/auth.middlewares'); // Usamos tu middleware

// Todas las rutas del carrito requieren autenticación
router.get('/', verifyToken, carritoController.getCart);
router.post('/agregar', verifyToken, carritoController.addToCart);
router.delete('/eliminar/:idProducto', verifyToken, carritoController.removeFromCart);
router.delete('/vaciar', verifyToken, carritoController.clearCart);

module.exports = router;
