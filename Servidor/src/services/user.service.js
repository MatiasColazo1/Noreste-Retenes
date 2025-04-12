const UserDAO = require('../daos/user.daos');
const bcrypt = require('bcrypt');
const validateUser = require('../utils/validateUser');
const { checkDuplicateFields } = require('../validators/userValidator');


const UserService = {
    registerUser: async (userData) => {
        try {
            const validationResult = validateUser(userData);
            if (!validationResult.isValid) {
                const error = new Error('Datos de usuario inválidos');
                error.details = validationResult.errors;
                throw error;
            }
    
            const duplicateErrors = await checkDuplicateFields(userData);
            if (duplicateErrors.length > 0) {
                const error = new Error('Datos duplicados');
                error.details = duplicateErrors;
                throw error;
            }
    
            // Encriptar y crear
            const salt = await bcrypt.genSalt(10);
            userData.password = await bcrypt.hash(userData.password, salt);
    
            return await UserDAO.create(userData);
    
        } catch (error) {
            // Si el error tiene detalles, responder con esos detalles
            if (error.details) {
                return {
                    status: 400,
                    message: error.message || 'Error al procesar los datos del usuario',
                    details: error.details  // Detalles de los errores
                };
            }
    
            // Enviar un error general si no se proporcionan detalles específicos
            return {
                status: error.status || 500,
                message: error.message || 'Error interno del servidor',
                details: []  // Aquí no hay detalles de errores específicos
            };
        }

    },
    
    


    loginUser: async (email, password) => {
        try {
            console.log("Buscando usuario con email:", email);
            const user = await UserDAO.findByEmail(email);
            
            if (!user) {
                throw new Error('Email incorrecto');
            }            
    
            const isMatch = await bcrypt.compare(password, user.password);
            
            if (!isMatch) {
                throw new Error('Contraseña incorrecta');
            }
    
            return user;
        } catch (error) {
            // NO sobreescribas el mensaje acá
            throw error;
        }
    },
    

    getUserById: async (userId) => {
        try {
            return await UserDAO.findById(userId);
        } catch (error) {
            throw new Error('Error al obtener usuario: ' + error.message);
        }
    },
    updateUser: async (userId, updateData) => {
        try {
            // Eliminar la contraseña del objeto de actualización siempre
            if (updateData.hasOwnProperty("password")) {
                delete updateData.password;
            }
    
            return await UserDAO.updateById(userId, updateData);
        } catch (error) {
            throw new Error('Error al actualizar usuario: ' + error.message);
        }
    },
    

    deleteUser: async (userId) => {
        try {
            return await UserDAO.deleteById(userId);
        } catch (error) {
            throw new Error('Error al eliminar usuario: ' + error.message);
        }
    },

    getAllUsers: async () => {
        try {
            return await UserDAO.getAllUsers();
        } catch (error) {
            throw new Error('Error al obtener usuarios: ' + error.message);
        }
    }
};

module.exports = UserService;