const UserService = require('../services/user.service');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const UserDAO = require('../daos/user.daos')

const UserController = {
    // Registro de usuario

    //Registra un nuevo usuario. Recibe los datos desde el cuerpo de la solicitud (req.body) y los pasa al servicio registerUser
    // controllers/user.controller.js
    registerUser: async (req, res) => {
        try {
            console.log("Datos recibidos:", req.body);  // Esto imprimirá los datos recibidos
            const userData = req.body;
            const result = await UserService.registerUser(userData);  // Llamar al servicio

            // Si la respuesta tiene detalles, devolver esos detalles
            if (result.details) {
                return res.status(result.status).json({
                    message: result.message,
                    details: result.details  // Enviar los detalles de los errores
                });
            }

            // Si la creación del usuario fue exitosa
            res.status(201).json({
                message: 'Usuario registrado exitosamente',
                user: result.user,  // Devuelve el nuevo usuario
            });

        } catch (error) {
            console.error('Error al registrar usuario:', error);

            // Si el error tiene detalles, responder con esos detalles
            if (error.details) {
                return res.status(400).json({
                    message: error.message,
                    details: error.details  // Detalles de los errores
                });
            }

            // Error general del servidor
            res.status(500).json({
                message: 'Error interno del servidor',
                error: error.message,
            });
        }
    },


    // Inicio de sesión de usuario

    //Inicia sesión. Recibe el email y la contraseña, luego pasa estos datos al servicio loginUser. Si la autenticación es exitosa, genera un JWT (token) y lo devuelve en la respuesta.
    // loginUser: Inicia sesión de usuario
    loginUser: async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    message: 'Email y contraseña son requeridos',
                });
            }

            // Pasar email y password al servicio
            const user = await UserService.loginUser(email, password);

            if (!user) {
                return res.status(400).json({
                    message: 'Email o contraseña incorrectos',
                });
            }

            // Generar el token incluyendo listaPrecio
            const token = jwt.sign(
                {
                    _id: user._id,
                    email: user.email,
                    role: user.role,
                    listaPrecio: user.listaPrecio,
                    descuentos: user.descuentos,
                    tipoCliente: user.tipoCliente 
                },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.status(200).json({
                message: 'Inicio de sesión exitoso',
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.nombre,
                    role: user.role,
                    listaPrecio: user.listaPrecio,
                    descuentos: user.descuentos,
                    tipoCliente: user.tipoCliente 
                },
            });
        } catch (error) {
            res.status(400).json({
                message: error.message // 👈 mandás el mensaje real como 'Usuario no encontrado'
            });
        }
    },


    // Obtener usuario por ID

    //Obtiene los datos del usuario utilizando su userId pasado como parámetro en la URL. Si el usuario no existe, devuelve un error 404.
    getUserById: async (req, res) => {
        try {
            const { userId } = req.params;
            const user = await UserService.getUserById(userId);
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            res.status(200).json({ user });
        } catch (error) {
            res.status(400).json({
                message: 'Error al obtener usuario',
                error: error.message,
            });
        }
    },

    // Actualizar usuario

    //Permite actualizar los datos de un usuario específico. Recibe el userId como parámetro y los datos a actualizar en el cuerpo de la solicitud. Devuelve el usuario actualizado
    updateUser: async (req, res) => {
        try {
            const { userId } = req.params;
            const updateData = req.body;
            const updatedUser = await UserService.updateUser(userId, updateData);
            res.status(200).json({
                message: 'Usuario actualizado exitosamente',
                user: updatedUser,
            });
        } catch (error) {
            res.status(400).json({
                message: 'Error al actualizar usuario',
                error: error.message,
            });
        }
    },

    // Eliminar usuario

    //Elimina un usuario por su userId pasado como parámetro.
    deleteUser: async (req, res) => {
        try {
            const { userId } = req.params;
            const deletedUser = await UserService.deleteUser(userId);
            res.status(200).json({
                message: 'Usuario eliminado exitosamente',
                user: deletedUser,
            });
        } catch (error) {
            res.status(400).json({
                message: 'Error al eliminar usuario',
                error: error.message,
            });
        }
    },

    // Obtener todos los usuarios (administrador)

    //Recupera todos los usuarios registrados (solo para administradores).
    getAllUsers: async (req, res) => {
        try {
            const { page = 1, limit = 20 } = req.query;
            const redisClient = req.app.locals.redisClient;

            const users = await UserService.getAllUsers(redisClient, parseInt(page), parseInt(limit));
            res.status(200).json({ users });
        } catch (error) {
            res.status(400).json({
                message: 'Error al obtener usuarios',
                error: error.message,
            });
        }
    },

    //usuarios con desceuntos
    updateUserDiscounts: async (req, res) => {
        try {
            const { userId } = req.params;
            const { descuentos } = req.body;

            if (!Array.isArray(descuentos)) {
                return res.status(400).json({
                    message: 'El campo descuentos debe ser un array',
                });
            }

            const updatedUser = await UserService.updateUserDiscounts(userId, descuentos);

            res.status(200).json({
                message: 'Descuentos actualizados correctamente',
                user: updatedUser,
            });
        } catch (error) {
            res.status(400).json({
                message: 'Error al actualizar descuentos',
                error: error.message,
            });
        }
    },

    // user.controller.js
 getUsersByFiltroParcial: async (req, res) => {
    try {
      const { filtro } = req.query;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;
      const redisClient = req.app.locals.redisClient;
  
      const cacheKey = `users_filtro:${filtro}_page:${page}_limit:${limit}`;
  
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        return res.status(200).json(JSON.parse(cached));
      }
  
      const { users, total } = await UserDAO.getUsersByFiltroParcial(filtro, skip, limit);
  
      const result = { users, total };
  
      await redisClient.setEx(cacheKey, 300, JSON.stringify(result)); // 5 minutos
  
      return res.status(200).json(result);
    } catch (error) {
      console.error("❌ Error en getUsersByFiltroParcial:", error);
      return res.status(500).json({ error: "Error al buscar usuarios por filtro parcial" });
    }
  },

  forgotPassword: async (req, res) => {
    try {
        const { email } = req.body;
        const result = await UserService.forgotPassword(email);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
},

resetPassword: async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        const result = await UserService.resetPassword(token, newPassword);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


  
  

};

module.exports = UserController;
