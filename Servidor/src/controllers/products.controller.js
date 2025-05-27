const ProductDAO = require('../daos/products.daos');
const xlsx = require('xlsx');
const fs = require('fs');
const Product = require('../models/products.model');
const User = require('../models/user.model');
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

// Actualizar producto por ID
const updateProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const redisClient = req.app.locals.redisClient;

    const updatedProduct = await ProductDAO.updateProductById(id, updatedData, redisClient);

    return res.status(200).json({ message: 'Producto actualizado correctamente', product: updatedProduct });
  } catch (error) {
    return res.status(500).json({ error: 'Error al actualizar el producto' });
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
    const { Imagen } = req.body;

    const product = await ProductDAO.updateImage(id, Imagen);
    return res.status(200).json({ message: 'Imagen actualizada correctamente', product });
  } catch (error) {
    console.error("❌ Error en updateProductImage:", error);
    return res.status(500).json({ error: "Error al actualizar la imagen" });
  }
};

const getProductsByUser = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const redisClient = req.app.locals.redisClient;

    // Buscamos el usuario actualizado por ID
    const user = await User.findById(req.user._id); // Asegurate de que req.user._id esté disponible

    if (!user || !user.listaPrecio) {
      return res.status(400).json({ error: "No se pudo determinar la lista de precios del usuario" });
    }

    const { listaPrecio, descuentos = [] } = user;

    const products = await ProductDAO.getProductsByUser(
      listaPrecio,
      redisClient,
      parseInt(page),
      parseInt(limit)
    );

    const productosConDescuento = products.map(p => {
      const keyPrecio = "Precio" + listaPrecio.replace(/\s+/g, '');
      const precioBase = p[keyPrecio] || 0;

      const nombreRubro = p.NombreRubro?.toUpperCase().trim() || '';

      const descuentoRubro = descuentos.find(d =>
        d.rubro?.toUpperCase().trim() === nombreRubro
      );

      const porcentaje = descuentoRubro?.porcentaje || 0;
      const precioConDescuento = precioBase - (precioBase * (porcentaje / 100));

      return {
        ...p,
        Precio: precioBase,
        precioOriginal: precioBase,
        precioFinal: parseFloat(precioConDescuento.toFixed(2)),
        descuentoAplicado: porcentaje
      };
    });

    res.json({ productos: productosConDescuento });

  } catch (error) {
    console.error("Error en getProductsByUser:", error);
    res.status(500).json({ error: "Ocurrió un error al obtener los productos." });
  }
};

const getPrecioProductoById = async (req, res) => {
  try {
    const redisClient = req.app.locals.redisClient;
    const user = await User.findById(req.user._id);
    const product = await Product.findById(req.params.id);

    if (!user || !user.listaPrecio || !product) {
      return res.status(404).json({ error: "Datos no encontrados" });
    }

    const keyPrecio = "Precio" + user.listaPrecio.replace(/\s+/g, '');
    const precioBase = product[keyPrecio] || 0;

    const nombreRubro = product.NombreRubro?.toUpperCase().trim() || '';
    const descuentoRubro = user.descuentos?.find(d =>
      d.rubro?.toUpperCase().trim() === nombreRubro
    );

    const porcentaje = descuentoRubro?.porcentaje || 0;
    const precioConDescuento = precioBase - (precioBase * (porcentaje / 100));

    res.json({
      _id: product._id,
      nombre: product.NombreProducto,
      precioOriginal: precioBase,
      precioFinal: parseFloat(precioConDescuento.toFixed(2)),
      descuentoAplicado: porcentaje
    });

  } catch (err) {
    console.error("Error en getPrecioProductoById:", err);
    res.status(500).json({ error: "Error al obtener el precio del producto" });
  }
};


//filtro codigo
const getProductsByCodigoParcial = async (req, res) => {
  try {
    const { codigo } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const redisClient = req.app.locals.redisClient;

    const cacheKey = `products_codigo:${codigo}_page:${page}_limit:${limit}`;

    // Buscar en caché
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }

    // Buscar en DB (pasa page y limit, no skip)
    const { products, total, totalPages } = await ProductDAO.getProductsByCodigoParcial(codigo, page, limit);

    const result = { products, total, page, limit, totalPages };

    // Guardar en caché por 5 minutos
    await redisClient.setEx(cacheKey, 300, JSON.stringify(result));

    return res.status(200).json(result);
  } catch (error) {
    console.error("❌ Error en getProductsByCodigoParcial:", error);
    return res.status(500).json({ error: "Error al buscar productos por código parcial" });
  }
};



// Actualizar una equivalencia específica
const updateEquivalencia = async (req, res) => {
  try {
    const { id, equivalencia } = req.params;  // id del producto y equivalencia que se quiere actualizar
    const { nuevaEquivalencia } = req.body;  // nueva equivalencia
    const redisClient = req.app.locals.redisClient;

    if (!nuevaEquivalencia || nuevaEquivalencia.trim() === '') {
      return res.status(400).json({ error: "Nueva equivalencia vacía o inválida" });
    }

    const product = await ProductDAO.updateEquivalencia(id, equivalencia, nuevaEquivalencia, redisClient);

    return res.status(200).json({ message: 'Equivalencia actualizada correctamente', product });
  } catch (error) {
    console.error("❌ Error en updateEquivalencia:", error);
    return res.status(500).json({ error: "Error al actualizar equivalencia" });
  }
};

// Agregar una sola equivalencia
const addEquivalencia = async (req, res) => {
  try {
    const { id } = req.params;
    const { equivalencia } = req.body;
    const redisClient = req.app.locals.redisClient;

    if (!equivalencia || equivalencia.trim() === '') {
      return res.status(400).json({ error: "Equivalencia vacía o inválida" });
    }

    const product = await ProductDAO.addEquivalencia(id, equivalencia, redisClient);

    return res.status(200).json({ message: 'Equivalencia agregada correctamente', product });
  } catch (error) {
    console.error("❌ Error en addEquivalencia:", error);
    return res.status(500).json({ error: "Error al agregar equivalencia" });
  }
};

// Eliminar una sola equivalencia
const removeEquivalencia = async (req, res) => {
  try {
    const { id, equivalencia } = req.params;  // Obtener equivalencia directamente de los params
    const redisClient = req.app.locals.redisClient;

    if (!equivalencia || equivalencia.trim() === '') {
      return res.status(400).json({ error: "Equivalencia vacía o inválida" });
    }

    const product = await ProductDAO.removeEquivalencia(id, equivalencia, redisClient);

    return res.status(200).json({ message: 'Equivalencia eliminada correctamente', product });
  } catch (error) {
    console.error("❌ Error en removeEquivalencia:", error);
    return res.status(500).json({ error: "Error al eliminar equivalencia" });
  }
};


// Buscar por coincidencia parcial
const getProductsByEquivalencia = async (req, res) => {
  try {
    const { equivalenciaParcial } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const redisClient = req.app.locals.redisClient;

    const cacheKey = `products_equivalencia:${equivalenciaParcial}_page:${page}_limit:${limit}`;

    // Buscar en caché
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }

    // Buscar en la base de datos
    const { products, total, totalPages } = await ProductDAO.getProductsByEquivalencia(equivalenciaParcial, page, limit);

    const result = { products, total, page, limit, totalPages };

    // Guardar en caché por 5 minutos
    await redisClient.setEx(cacheKey, 300, JSON.stringify(result));

    return res.status(200).json(result);
  } catch (error) {
    console.error("❌ Error en getProductsByEquivalencia:", error);
    return res.status(500).json({ error: "Error al buscar productos por equivalencia" });
  }
};


//filtro medidas
const getProductsByMedidas = async (req, res) => {
  try {
    const { INTERIOR, EXTERIOR, ANCHO, NombreRubro, page = 1, limit = 20 } = req.query;

    const filters = {};
    if (INTERIOR) filters.INTERIOR = Number(INTERIOR);
    if (EXTERIOR) filters.EXTERIOR = Number(EXTERIOR);
    if (ANCHO) filters.ANCHO = Number(ANCHO);
    if (NombreRubro) filters.NombreRubro = NombreRubro;

    const result = await ProductDAO.getProductsByMedidas(filters, parseInt(page), parseInt(limit));

    return res.json(result);
  } catch (error) {
    console.error('❌ Error en getProductsByMedidas:', error);
    return res.status(500).json({ error: 'Error al buscar productos por medidas' });
  }
};

// Nuevo controlador para obtener todos los nombres de rubros


const getRubroNames = async (req, res) => {
  try {
    const rubrosUnicos = await Product.distinct('NombreRubro');
    return res.status(200).json(rubrosUnicos);
  } catch (error) {
    console.error("❌ Error al obtener nombres de rubros:", error);
    return res.status(500).json({ error: "Error al obtener nombres de rubros" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const result = await ProductDAO.deleteProductById(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    console.error("❌ Error al eliminar producto:", error);
    return res.status(500).json({ error: error.message || "Error interno" });
  }
};



module.exports = { uploadExcel, getProducts, getProductById, updateProductById, uploadPrices, updateProductImage, getProductsByUser, getPrecioProductoById, getProductsByCodigoParcial, updateEquivalencia, addEquivalencia, removeEquivalencia, getProductsByEquivalencia, getProductsByMedidas, getRubroNames, deleteProduct};
