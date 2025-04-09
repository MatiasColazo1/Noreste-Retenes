const express = require('express');
const multer = require('multer');
const ProductController = require('../controllers/products.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middlewares');

const router = express.Router();

// Configurar Multer para la subida de archivos Excel
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'), // Carpeta donde se guardan los archivos
    filename: (req, file, cb) => cb(null, `catalogo_${Date.now()}.xlsx`), // Nombre único
});
const upload = multer({ storage });

// 🔹 **Rutas de productos**
router.get('/', verifyToken, ProductController.getProducts); // Obtener productos con paginación
router.get('/:id', verifyToken, ProductController.getProductById);
router.put('/:id/image', verifyToken, isAdmin, ProductController.updateProductImage);
router.post('/upload', verifyToken, isAdmin, upload.single('file'), ProductController.uploadExcel); // Subir archivo Excel (solo admin)
router.post('/upload-prices', verifyToken, isAdmin, upload.single('file'), ProductController.uploadPrices);



module.exports = router;
