const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./src/routes/user.routes');
const productRoutes = require('./src/routes/products.routes'); // 🔹 Importa las rutas de productos
const pdfRoutes = require('./src/routes/pdf.routes');
const carritoRoutes = require('./src/routes/carrito.routes');
const aplicacionRoutes = require('./src/routes/aplicacion.routes');

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
app.use('/api/pdf', pdfRoutes);
app.use('/api/carrito', carritoRoutes);
app.use('/api/aplicacion', aplicacionRoutes);

module.exports = app;
