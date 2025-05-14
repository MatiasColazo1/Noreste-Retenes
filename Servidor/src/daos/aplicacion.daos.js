const Aplicacion = require('../models/aplicacion.model');

class AplicacionDAO {

    // ✅ Obtener todas las aplicaciones de un producto (usa caché)
    static async getAplicacionesByProducto(productoId, redisClient) {
        const cacheKey = `aplicaciones:producto:${productoId}`;
        try {
            const cachedData = await redisClient?.get(cacheKey);
            if (cachedData) return JSON.parse(cachedData);

            const aplicaciones = await Aplicacion.find({ producto: productoId }).lean();
            await redisClient?.setEx(cacheKey, 600, JSON.stringify(aplicaciones));

            return aplicaciones;
        } catch (error) {
            console.error('❌ Error al obtener aplicaciones:', error);
            throw error;
        }
    }

    // ❌ Crear una aplicación (solo invalida caché)
    static async createAplicacion(aplicacionData, redisClient) {
        try {
            const nuevaAplicacion = new Aplicacion(aplicacionData);
            await nuevaAplicacion.save();

            await redisClient?.del(`aplicaciones:producto:${aplicacionData.producto}`);

            return nuevaAplicacion.toObject();
        } catch (error) {
            console.error('❌ Error al crear aplicación:', error);
            throw error;
        }
    }

    // ❌ Eliminar una aplicación (solo invalida caché)
    static async deleteAplicacion(aplicacionId, redisClient) {
        try {
            const deleted = await Aplicacion.findByIdAndDelete(aplicacionId).lean();
            if (deleted) {
                await redisClient?.del(`aplicaciones:producto:${deleted.producto}`);
            }
            return deleted;
        } catch (error) {
            console.error('❌ Error al eliminar aplicación:', error);
            throw error;
        }
    }

    // ❌ Editar una aplicación (solo invalida caché)
    static async updateAplicacion(aplicacionId, updateData, redisClient) {
        try {
            const updated = await Aplicacion.findByIdAndUpdate(aplicacionId, updateData, { new: true }).lean();
            if (updated) {
                await redisClient?.del(`aplicaciones:producto:${updated.producto}`);
            }
            return updated;
        } catch (error) {
            console.error('❌ Error al actualizar aplicación:', error);
            throw error;
        }
    }

    // ✅ Obtener todas las marcas únicas (usa caché)
    static async getMarcasUnicas(redisClient) {
        const cacheKey = 'aplicaciones:marcasUnicas';
        try {
            const cached = await redisClient?.get(cacheKey);
            if (cached) return JSON.parse(cached);

            const marcas = await Aplicacion.distinct('marcaVehiculo');
            marcas.sort();

            await redisClient?.setEx(cacheKey, 600, JSON.stringify(marcas));
            return marcas;
        } catch (error) {
            console.error('❌ Error al obtener marcas únicas:', error);
            throw error;
        }
    }

    // ✅ Obtener modelos únicos por marca (usa caché)
    static async getModelosByMarca(marcaVehiculo, redisClient) {
        const cacheKey = `aplicaciones:modelos:${marcaVehiculo}`;
        try {
            const cached = await redisClient?.get(cacheKey);
            if (cached) return JSON.parse(cached);

            const modelos = await Aplicacion.find({ marcaVehiculo }).distinct('modeloVehiculo');
            modelos.sort();

            await redisClient?.setEx(cacheKey, 600, JSON.stringify(modelos));
            return modelos;
        } catch (error) {
            console.error('❌ Error al obtener modelos por marca:', error);
            throw error;
        }
    }

    // ✅ Obtener todas las aplicaciones con paginación (usa caché)
    static async getAplicaciones(redisClient, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const cacheKey = `aplicaciones:all:page:${page}:limit:${limit}`;
        try {
            const cachedData = await redisClient?.get(cacheKey);
            if (cachedData) return JSON.parse(cachedData);

            const aplicaciones = await Aplicacion.find().skip(skip).limit(limit).lean();
            const total = await Aplicacion.countDocuments();

            const result = {
                aplicaciones,
                total,
                page,
                totalPages: Math.ceil(total / limit)
            };

            await redisClient?.setEx(cacheKey, 600, JSON.stringify(result));
            return result;
        } catch (error) {
            console.error('❌ Error al obtener todas las aplicaciones:', error);
            throw error;
        }
    }

    // ❌ Obtener una aplicación por ID (no caché)
    static async getAplicacionById(aplicacionId) {
        try {
            return await Aplicacion.findById(aplicacionId).lean();
        } catch (error) {
            console.error('❌ Error al obtener aplicación por ID:', error);
            throw error;
        }
    }

    // ✅ Obtener aplicaciones por marca y modelo (opcional caché si es muy usado)
    static async getAplicacionesByMarcaModelo(marcaVehiculo, modeloVehiculo, redisClient) {
        const filtro = {
            ...(marcaVehiculo && { marcaVehiculo }),
            ...(modeloVehiculo && { modeloVehiculo }),
        };

        const cacheKey = `aplicaciones:filtro:${marcaVehiculo || 'any'}:${modeloVehiculo || 'any'}`;

        try {
            const cached = await redisClient?.get(cacheKey);
            if (cached) return JSON.parse(cached);

            const aplicaciones = await Aplicacion.find(filtro).lean();

            await redisClient?.setEx(cacheKey, 600, JSON.stringify(aplicaciones));
            return aplicaciones;
        } catch (error) {
            console.error('❌ Error al obtener aplicaciones por marca y modelo:', error);
            throw error;
        }
    }
}

module.exports = AplicacionDAO;
