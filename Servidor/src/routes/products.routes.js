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

// 🔹 Rutas de productos
router.get('/', verifyToken, ProductController.getProducts); // Obtener productos con paginación
router.get('/by-user', verifyToken, ProductController.getProductsByUser); // 🔁 CAMBIADA PARA EVITAR CONFLICTO
router.get('/buscar', verifyToken, ProductController.getProductsByCodigoParcial);// Obtener producto por código
router.get('/rubros', verifyToken, ProductController.getRubroNames); // esta primero
router.get('/:id', verifyToken, ProductController.getProductById); // Obtener producto por ID
router.get('/:id/precio', verifyToken, ProductController.getPrecioProductoById);
router.delete('/:id', verifyToken, isAdmin, ProductController.deleteProduct);

//imagen
router.put('/:id/image', verifyToken, isAdmin, ProductController.updateProductImage);

router.post('/upload', verifyToken, isAdmin, upload.single('file'), ProductController.uploadExcel); // Subir archivo Excel (solo admin)
router.post('/upload-prices', verifyToken, isAdmin, upload.single('file'), ProductController.uploadPrices); // Subir lista de precios

// rutas de equivalencias
router.post('/:id/equivalencias', verifyToken, isAdmin, ProductController.addEquivalencia);   // Agregar una equivalencia
router.put('/:id/equivalencias/:equivalencia', verifyToken, isAdmin, ProductController.updateEquivalencia); // Reemplazar la equivalencia
router.delete('/:id/equivalencias/:equivalencia', verifyToken, isAdmin, ProductController.removeEquivalencia); // Eliminar una equivalencia
router.get('/equivalencias/buscar', verifyToken, ProductController.getProductsByEquivalencia); // Buscar productos por equivalencia parcial

// filtro medidas
router.get('/medidas/buscar', verifyToken, ProductController.getProductsByMedidas);







module.exports = router;
