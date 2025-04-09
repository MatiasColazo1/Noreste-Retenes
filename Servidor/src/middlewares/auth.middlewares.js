const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// Middleware para verificar el token
const verifyToken = (req, res, next) => {
    // Extraer el token del encabezado Authorization
    const token = req.headers['authorization'];

    // Verificar si el token está presente
    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado. Token requerido.' });
    }

    // Asegurarse de que el token comienza con 'Bearer'
    if (!token.startsWith('Bearer ')) {
        return res.status(400).json({ error: 'Token mal formado. Debe comenzar con "Bearer ". ' });
    }

    // Extraer el token (sin la palabra 'Bearer ')
    const actualToken = token.split(' ')[1];

    try {
        // Verificar y decodificar el token usando la clave secreta
        const verified = jwt.verify(actualToken, process.env.JWT_SECRET); // Usar variable de entorno para la clave secreta
        req.user = verified; // Guardamos la información del usuario decodificada en req.user
        next(); // Continuar al siguiente middleware o controlador
    } catch (error) {
        return res.status(400).json({ error: 'Token inválido o expirado.' });
    }
};

// Middleware para verificar si el usuario es admin
const isAdmin = async (req, res, next) => {
    try {
        if (!req.user || !req.user.userId) {  // Cambié 'id' a 'userId' para que coincida con el token
            return res.status(400).json({ message: 'Información de usuario no válida en el token.' });
        }

        const user = await User.findById(req.user.userId);  // Usar 'userId' para buscar al usuario

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        console.log('Usuario encontrado:', user); // Para depurar y asegurarte de que el usuario se está encontrando correctamente

        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador.' });
        }

        next();
    } catch (error) {
        console.error('Error en la verificación del rol de administrador:', error);
        res.status(500).json({ message: 'Error en la verificación del rol de administrador.', error: error.message });
    }
};

module.exports = { verifyToken, isAdmin };
