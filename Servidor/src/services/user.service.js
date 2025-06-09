const UserDAO = require('../daos/user.daos');
const bcrypt = require('bcrypt');
const validateUser = require('../utils/validateUser');
const { checkDuplicateFields } = require('../validators/userValidator');

const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

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

        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        userData.password = await bcrypt.hash(userData.password, salt);

        // 🔢 Asignar número incremental
        const userCount = await UserDAO.countUsers();  // 👈 Te muestro abajo cómo implementarlo
        userData.numero = (userCount + 1).toString().padStart(4, '0');  // "0001", "0010", etc.

        // Crear usuario
        const newUser = await UserDAO.create(userData);

        return {
            status: 201,
            message: 'Usuario registrado exitosamente',
            user: newUser
        };

    } catch (error) {
        if (error.details) {
            return {
                status: 400,
                message: error.message || 'Error al procesar los datos del usuario',
                details: error.details
            };
        }

        return {
            status: error.status || 500,
            message: error.message || 'Error interno del servidor',
            details: []
        };
    }
},

    loginUser: async (email, password) => {
        try {
            console.log("Buscando usuario con email:", email);
            const user = await UserDAO.findByEmail(email);

            if (!user || !(await bcrypt.compare(password, user.password))) {
                console.log("❌ Email o contraseña incorrectos");
                throw new Error('Email o contraseña incorrectos');
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

    getAllUsers: async (redisClient, page, limit) => {
        try {
            return await UserDAO.getAllUsers(redisClient, page, limit);
        } catch (error) {
            throw new Error('Error al obtener usuarios: ' + error.message);
        }
    },


    updateUserDiscounts: async (userId, descuentos) => {
        try {
            return await UserDAO.updateById(userId, { descuentos });
        } catch (error) {
            throw new Error('Error al actualizar descuentos del usuario: ' + error.message);
        }
    },

    forgotPassword: async (email) => {
        const user = await UserDAO.findByEmail(email);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
    
        const token = crypto.randomBytes(20).toString('hex');
        const expires = Date.now() + 3600000; // 1 hora
    
        await UserDAO.updateById(user._id, {
            resetPasswordToken: token,
            resetPasswordExpires: expires
        });
    
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    
        await sendEmail({
            to: user.email,
            subject: 'Restablecer contraseña',
            text: `Hacé clic en el siguiente enlace para restablecer tu contraseña: ${resetUrl}`
        });
    
        return { message: 'Se envió un correo con instrucciones para restablecer la contraseña' };
    },
    
    resetPassword: async (token, newPassword) => {
        const user = await UserDAO.findByResetToken(token);
        if (!user || user.resetPasswordExpires < Date.now()) {
            throw new Error('El token no es válido o ha expirado');
        }
    
        // ⚠️ Validar nueva contraseña
        const validation = validateUser({ password: newPassword });
if (!validation.isValid) {
    throw new Error(validation.errors.join(" "));
}

    
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
    
        await UserDAO.updateById(user._id, {
            password: hashedPassword,
            resetPasswordToken: undefined,
            resetPasswordExpires: undefined
        }, true);
    
        return { message: 'Contraseña actualizada exitosamente' };
    }

};


module.exports = UserService;