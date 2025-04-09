const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./src/routes/user.routes');
const productRoutes = require('./src/routes/products.routes'); // 🔹 Importa las rutas de productos

dotenv.config(); // Cargar variables de entorno

const app = express();

// Middlewares
app.use(express.json()); // Permitir JSON en las peticiones
app.use(cors()); // Habilitar CORS

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('¡Servidor Express funcionando!');
});

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes); // 🔹 Agrega las rutas de productos

module.exports = app;
