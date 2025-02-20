const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');

// ... otras configuraciones ...

// Rutas
app.use('/api/users', userRoutes);

// ... resto del código ... 