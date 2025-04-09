const app = require('./app');
const { connectDB, redisClient } = require('./src/config/db');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connectDB(); // Conectar a MongoDB

        // Verificar si Redis ya está conectado antes de llamar a connect()
        if (!redisClient.isOpen) {
            await redisClient.connect();
        }

        // Guardar redisClient en app.locals para que esté accesible en los controladores
        app.locals.redisClient = redisClient;



        app.listen(PORT, () => {
            console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Error crítico: No se pudo iniciar el servidor', error);
    }
};

startServer();
