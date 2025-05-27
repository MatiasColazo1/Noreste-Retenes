const express = require('express'); 
const router = express.Router();
const { generarPDFCarrito } = require('../controllers/pdf.controller');
const { verifyToken } = require('../middlewares/auth.middlewares'); 

// Ruta para generar el PDF del carrito
router.post('/carrito/pdf', verifyToken, generarPDFCarrito);

module.exports = router;
