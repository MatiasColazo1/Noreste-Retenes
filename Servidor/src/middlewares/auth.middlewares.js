const jwt = require('jsonwebtoken');

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
        return res.status(400).json({ error: 'Token mal formado. Debe comenzar con "Bearer ". '});
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

module.exports = { verifyToken };
