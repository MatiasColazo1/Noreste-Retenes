const express = require('express');
const AplicacionController = require('../controllers/aplicacion.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middlewares');

const router = express.Router();


// 🔹 Filtros públicos para usuarios
router.get('/filtro/marcas', verifyToken, AplicacionController.getMarcasUnicas); // Obtener marcas únicas
router.get('/filtro/modelos/:marcaVehiculo', verifyToken, AplicacionController.getModelosByMarca); // Modelos por marca
router.get('/filtro', verifyToken, AplicacionController.getAplicacionesByMarcaModelo); // Filtro combinado marca + modelo

// 🔹 Para obtener aplicaciones de un producto específico (puede usarse en ficha de producto)
router.get('/producto/:productoId', verifyToken, AplicacionController.getAplicacionesByProducto);
// 🔹 CRUD principal (admin)
router.get('/', verifyToken, isAdmin, AplicacionController.getAplicaciones); // Listar todas
router.get('/:id', verifyToken, isAdmin, AplicacionController.getAplicacionById); // Obtener una por ID
router.post('/', verifyToken, isAdmin, AplicacionController.createAplicacion); // Crear nueva
router.put('/:id', verifyToken, isAdmin, AplicacionController.updateAplicacion); // Actualizar una
router.delete('/:id', verifyToken, isAdmin, AplicacionController.deleteAplicacion); // Eliminar una

module.exports = router;
