require('dotenv').config(); // Cargar variables de entorno desde .env
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();

// ================== Middleware ================== //
app.use(cors());          // Habilitar CORS para todas las solicitudes
app.use(express.json());  // Habilitar JSON en el body

// ================== Rutas ================== //
app.use('/api', apiRoutes);

// ================== Manejo de Errores ================== //
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Error interno del servidor' });
});

// ================== Iniciar Servidor ================== //
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en: http://localhost:${PORT}/api`);
});
