const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./src/routes/user.routes');

dotenv.config(); // Cargar variables de entorno

const app = express();

// Middlewares
app.use(express.json()); // Permitir JSON en las peticiones
app.use(cors()); // Habilitar CORS

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('¡Servidor Express funcionando!');
});

// Importar y usar rutas aquí si es necesario
app.use('/api/users', userRoutes);
// app.use('/api/usuarios', require('./routes/usuarios'));

module.exports = app;