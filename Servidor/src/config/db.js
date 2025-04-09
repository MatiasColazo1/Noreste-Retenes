const mongoose = require('mongoose');
const dotenv = require('dotenv');
const redis = require('redis');

dotenv.config(); // Cargar variables de entorno desde .env

const MONGO_URI = process.env.MONGO_URI;
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// Función para conectar a MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });

        console.log('✅ Conexión a MongoDB exitosa');
    } catch (error) {
        console.error('❌ Error al conectar con MongoDB:', error);
        setTimeout(async () => {
            console.log('🔄 Reintentando conexión con MongoDB...');
            await connectDB();
        }, 5000);
    }
};

// Conexión a Redis
const redisClient = redis.createClient({
    url: REDIS_URL,
    legacyMode: true,  // ⚠️ Agregar esta opción para compatibilidad con Redis v3 y v4
});

redisClient.on('connect', () => console.log('🟢 Conectado a Redis'));
redisClient.on('error', (err) => console.error('🔴 Error en Redis:', err));

redisClient.connect().catch(console.error);

// Exportar las conexiones
module.exports = { connectDB, redisClient };