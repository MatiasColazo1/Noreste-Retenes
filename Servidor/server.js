const app = require('./app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 3000;

// Conectar a la base de datos antes de iniciar el servidor
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
    });
}).catch(error => {
    console.error('❌ Error crítico: No se pudo iniciar el servidor', error);
});