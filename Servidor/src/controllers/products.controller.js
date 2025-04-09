const ProductDAO = require('../daos/products.daos');
const xlsx = require('xlsx');
const fs = require('fs');

// Subir y procesar el archivo Excel
const uploadExcel = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No se ha subido ningún archivo" });
        }

        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        fs.unlinkSync(req.file.path);

        const redisClient = req.app.locals.redisClient;

        if (!redisClient || !redisClient.setEx) {  // <-- Verifica si Redis es válido
            console.error("❌ RedisClient no está definido o no tiene 'setEx'");
            return res.status(500).json({ error: "Error interno: Redis no está disponible" });
        }

        await ProductDAO.syncProducts(data, redisClient);

        return res.status(200).json({ message: "Catálogo actualizado correctamente" });
    } catch (error) {
        console.error("❌ Error en uploadExcel:", error);
        return res.status(500).json({ error: "Error al procesar el archivo" });
    }
};

// Obtener productos con paginación
const getProducts = async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const redisClient = req.app.locals.redisClient; // Acceder a Redis desde la app

        const products = await ProductDAO.getProducts(redisClient, parseInt(page), parseInt(limit));

        return res.status(200).json(products);
    } catch (error) {
        console.error("❌ Error en getProducts:", error);
        return res.status(500).json({ error: "Error al obtener productos" });
    }
};

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await ProductDAO.getProductById(id);

        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({ error: "Error al obtener el producto" });
    }
};

const uploadPrices = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No se ha subido ningún archivo" });
        }

        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        fs.unlinkSync(req.file.path);

        await ProductDAO.syncPrices(data);

        return res.status(200).json({ message: "Precios actualizados correctamente" });
    } catch (error) {
        console.error("❌ Error en uploadPrices:", error);
        return res.status(500).json({ error: "Error al procesar el archivo de precios" });
    }
};

const updateProductImage = async (req, res) => {
    try {
        const { id } = req.params;
        const { ImagenUrl } = req.body;

        const product = await ProductDAO.updateImage(id, ImagenUrl);
        return res.status(200).json({ message: 'Imagen actualizada correctamente', product });
    } catch (error) {
        console.error("❌ Error en updateProductImage:", error);
        return res.status(500).json({ error: "Error al actualizar la imagen" });
    }
};

module.exports = { uploadExcel, getProducts, getProductById, uploadPrices, updateProductImage };
