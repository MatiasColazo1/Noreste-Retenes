const UserDAO = require('../daos/user.daos');
const bcrypt = require('bcrypt');
const validatePassword = require('../utils/validatePassword'); // Importamos la validación

const UserService = {
    registerUser: async (userData) => {
        try {
            // Validar la contraseña antes de hashearla
            const passwordValidation = validatePassword(userData.password);
            if (!passwordValidation.isValid) {
                throw new Error(passwordValidation.message);
            }

            // Hashear la contraseña antes de guardar
            const salt = await bcrypt.genSalt(10);
            userData.password = await bcrypt.hash(userData.password, salt);

            // Crear el usuario en la base de datos
            const newUser = await UserDAO.create(userData);
            return newUser;
        } catch (error) {
            throw new Error('Error al registrar usuario: ' + error.message);
        }
    },

    loginUser: async (email, password) => {
        try {
            console.log("Buscando usuario con email:", email);
            const user = await UserDAO.findByEmail(email);
            
            if (!user) {
                console.log("❌ Usuario no encontrado");
                throw new Error('Usuario no encontrado');
            }
    
            console.log("Comparando contraseña...");
            const isMatch = await bcrypt.compare(password, user.password);
            
            if (!isMatch) {
                console.log("❌ Contraseña incorrecta");
                throw new Error('Contraseña incorrecta');
            }
    
            console.log("✅ Usuario autenticado correctamente");
            return user;
        } catch (error) {
            console.log("🔥 Error en login:", error.message);
            throw new Error('Error al iniciar sesión: ' + error.message);
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