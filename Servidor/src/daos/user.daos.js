const User = require('../models/user.model');

const UserDAO = {
    //Crea un nuevo usuario en la base de datos.
    create: async (userData) => {
        try {
            const user = new User(userData);
            return await user.save();
        } catch (error) {
            throw new Error('Error al crear usuario: ' + error.message);
        }
    },

    // Cuenta todos los usuarios
    countUsers: async () => {
        try {
            return await User.countDocuments();
        } catch (error) {
            throw new Error('Error al contar usuarios: ' + error.message);
        }
    },

    // Busca un usuario por su email.
    findByEmail: async (email) => {
        try {
            return await User.findOne({ email });
        } catch (error) {
            throw new Error('Error al buscar usuario por email: ' + error.message);
        }
    },

    // 🔍 Busca un usuario por su CUIT (nueva función)
    findByCuit: async (cuit) => {
        try {
            return await User.findOne({ cuit });
        } catch (error) {
            throw new Error('Error al buscar usuario por CUIT: ' + error.message);
        }
    },
    //Busca un usuario por su ID.
    findById: async (userId) => {
        try {
            return await User.findById(userId);
        } catch (error) {
            throw new Error('Error al buscar usuario por ID: ' + error.message);
        }
    },
    //Actualiza un usuario por su ID..
    updateById: async (userId, updateData) => {
        try {
            // Si updateData tiene password, eliminarlo antes de guardar
            if (updateData.hasOwnProperty("password")) {
                delete updateData.password;
            }

            return await User.findByIdAndUpdate(userId, updateData, { new: true });
        } catch (error) {
            throw new Error('Error al actualizar usuario: ' + error.message);
        }
    },

    //Elimina un usuario por su ID.
    deleteById: async (userId) => {
        try {
            return await User.findByIdAndDelete(userId);
        } catch (error) {
            throw new Error('Error al eliminar usuario: ' + error.message);
        }
    },
    // Obtiene todos los usuarios.
    getAllUsers: async (redisClient, page = 1, limit = 20) => {
        const cacheKey = `users:page:${page}:limit:${limit}`;

        try {
            const cachedData = await redisClient.get(cacheKey);
            if (cachedData) {
                return JSON.parse(cachedData);
            }

            const users = await User.find()
                .sort({ _id: 1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean();

            await redisClient.setEx(cacheKey, 600, JSON.stringify(users)); // Cache por 10 minutos

            return users;
        } catch (error) {
            throw new Error('Error al obtener usuarios: ' + error.message);
        }
    },

      getUsersByFiltroParcial: async (filtro, skip = 0, limit = 20) => {
        try {
          const regex = new RegExp(filtro, 'i');
      
          const searchFilter = filtro
            ? {
                $or: [
                  { nombre: { $regex: regex } },
                  { apellido: { $regex: regex } },
                  { ciudad: { $regex: regex } },
                  { numero: { $regex: regex } }
                ]
              }
            : {};
      
          const users = await User.find(searchFilter).skip(skip).limit(limit).lean();
          const total = await User.countDocuments(searchFilter);
      
          return { users, total };
        } catch (error) {
          console.error('❌ Error en getUsersByFiltroParcial:', error);
          throw error;
        }
      }
};


module.exports = UserDAO;