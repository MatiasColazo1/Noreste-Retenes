const UserService = require('../services/user.service');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const UserController = {
    // Registro de usuario

    //Registra un nuevo usuario. Recibe los datos desde el cuerpo de la solicitud (req.body) y los pasa al servicio registerUser
    registerUser: async (req, res) => {
        try {
            const userData = req.body;
            const newUser = await UserService.registerUser(userData);
            res.status(201).json({
                message: 'Usuario registrado exitosamente',
                user: newUser,
            });
        } catch (error) {
            res.status(400).json({
                message: 'Error al registrar usuario',
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

        // Generar el token
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },  // Agregar role aquí
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
            },
        });
    } catch (error) {
        res.status(400).json({
            message: 'Error al iniciar sesión',
            error: error.message,
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
            const users = await UserService.getAllUsers();
            res.status(200).json({ users });
        } catch (error) {
            res.status(400).json({
                message: 'Error al obtener usuarios',
                error: error.message,
            });
        }
    },
};

module.exports = UserController;
