const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { sequelize } = require('./models');
const initializeDb = require('./config/initDb');
const routes = require('./routes/index');
const path = require('path');
const fs = require('fs');
const bcryptjs = require('bcryptjs');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./config/swagger');
const seedRoles = require('./seeders/roleSeeder');

dotenv.config();
const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // URL de tu frontend
    credentials: true
}));
app.use(express.json());

// Crear directorio de uploads si no existe
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rutas
app.use('/api', routes);

// Sincronizar base de datos y crear roles
async function initializeDatabase() {
    try {
        await sequelize.sync();
        await seedRoles();
        console.log('Base de datos sincronizada y roles creados');
    } catch (error) {
        console.error('Error al inicializar la base de datos:', error);
    }
}

initializeDatabase();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
    console.log(`📚 Documentación disponible en http://localhost:${PORT}/api-docs`);
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Algo salió mal!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});
