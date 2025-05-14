const AplicacionDAO = require('../daos/aplicacion.daos');

// Obtener todas las aplicaciones (con paginación opcional)
const getAplicaciones = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const redisClient = req.app.locals.redisClient;

    const result = await AplicacionDAO.getAplicaciones(redisClient, parseInt(page), parseInt(limit));
    return res.status(200).json(result);
  } catch (error) {
    console.error("❌ Error en getAplicaciones:", error);
    return res.status(500).json({ error: "Error al obtener aplicaciones" });
  }
};

// Obtener una aplicación por ID
const getAplicacionById = async (req, res) => {
  try {
    const { id } = req.params;
    const aplicacion = await AplicacionDAO.getAplicacionById(id);

    if (!aplicacion) {
      return res.status(404).json({ error: "Aplicación no encontrada" });
    }

    return res.status(200).json(aplicacion);
  } catch (error) {
    console.error("❌ Error en getAplicacionById:", error);
    return res.status(500).json({ error: "Error al obtener aplicación" });
  }
};

// Filtro: obtener todas las marcas únicas
const getMarcasUnicas = async (req, res) => {
  try {
    const marcas = await AplicacionDAO.getMarcasUnicas();
    return res.status(200).json(marcas);
  } catch (error) {
    console.error("❌ Error en getMarcasUnicas:", error);
    return res.status(500).json({ error: "Error al obtener marcas" });
  }
};

// Filtro: obtener todos los modelos según la marca
const getModelosByMarca = async (req, res) => {
  try {
    const { marcaVehiculo } = req.params;

    if (!marcaVehiculo) {
      return res.status(400).json({ error: "Falta marcaVehiculo en la solicitud" });
    }

    const modelos = await AplicacionDAO.getModelosByMarca(marcaVehiculo);
    return res.status(200).json(modelos);
  } catch (error) {
    console.error("❌ Error en getModelosByMarca:", error);
    return res.status(500).json({ error: "Error al obtener modelos" });
  }
};

// Filtro combinado (marca + modelo)
const getAplicacionesByMarcaModelo = async (req, res) => {
  try {
    const { marcaVehiculo, modeloVehiculo } = req.query;

    const result = await AplicacionDAO.getAplicacionesByMarcaModelo(marcaVehiculo, modeloVehiculo);
    return res.status(200).json(result);
  } catch (error) {
    console.error("❌ Error en getAplicacionesByMarcaModelo:", error);
    return res.status(500).json({ error: "Error al filtrar aplicaciones" });
  }
};

// Crear aplicación
const createAplicacion = async (req, res) => {
  try {
    const redisClient = req.app.locals.redisClient;
    const nuevaAplicacion = await AplicacionDAO.createAplicacion(req.body, redisClient);
    return res.status(201).json(nuevaAplicacion);
  } catch (error) {
    console.error("❌ Error en createAplicacion:", error);
    return res.status(500).json({ error: "Error al crear aplicación" });
  }
};

// Actualizar aplicación
const updateAplicacion = async (req, res) => {
  try {
    const { id } = req.params;
    const redisClient = req.app.locals.redisClient;
    const updated = await AplicacionDAO.updateAplicacion(id, req.body, redisClient);

    if (!updated) {
      return res.status(404).json({ error: "Aplicación no encontrada" });
    }

    return res.status(200).json(updated);
  } catch (error) {
    console.error("❌ Error en updateAplicacion:", error);
    return res.status(500).json({ error: "Error al actualizar aplicación" });
  }
};

// Eliminar aplicación
const deleteAplicacion = async (req, res) => {
  try {
    const { id } = req.params;
    const redisClient = req.app.locals.redisClient;
    const deleted = await AplicacionDAO.deleteAplicacion(id, redisClient);

    if (!deleted) {
      return res.status(404).json({ error: "Aplicación no encontrada" });
    }

    return res.status(200).json({ message: "Aplicación eliminada correctamente" });
  } catch (error) {
    console.error("❌ Error en deleteAplicacion:", error);
    return res.status(500).json({ error: "Error al eliminar aplicación" });
  }
};

// Obtener aplicaciones por producto
const getAplicacionesByProducto = async (req, res) => {
  try {
    const { productoId } = req.params;
    const redisClient = req.app.locals.redisClient;
    const aplicaciones = await AplicacionDAO.getAplicacionesByProducto(productoId, redisClient);
    return res.status(200).json(aplicaciones);
  } catch (error) {
    console.error("❌ Error en getAplicacionesByProducto:", error);
    return res.status(500).json({ error: "Error al obtener aplicaciones del producto" });
  }
};

module.exports = {
  getAplicaciones,
  getAplicacionById,
  createAplicacion,
  updateAplicacion,
  deleteAplicacion,
  getMarcasUnicas,
  getModelosByMarca,
  getAplicacionesByMarcaModelo,
  getAplicacionesByProducto
};
