const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // Cargar variables de entorno desde .env

const MONGO_URI = process.env.MONGO_URI;

// Función para conectar a MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // Mantén el timeout si quieres
        });

        console.log('✅ Conexión a MongoDB exitosa');
    } catch (error) {
        console.error('❌ Error al conectar con MongoDB:', error);
        setTimeout(async () => {
            console.log('🔄 Reintentando conexión con MongoDB...');
            await connectDB();
        }, 5000); // Reintentar cada 5 segundos
    }
};

// Eventos para monitorear la conexión con MongoDB
mongoose.connection.on('connected', () => console.log('🟢 MongoDB conectado'));
mongoose.connection.on('error', (err) => console.error('🔴 Error en MongoDB:', err));
mongoose.connection.on('disconnected', () => console.log('🟠 MongoDB desconectado'));

// Exportar la función
module.exports = connectDB;
