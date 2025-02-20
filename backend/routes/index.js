const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const caseRoutes = require('./caseRoutes');
const commentRoutes = require('./commentRoutes');
const fileRoutes = require('./fileRoutes');

// Rutas de usuarios
router.use('/users', userRoutes);

// Rutas de casos
router.use('/cases', caseRoutes);

// Rutas de comentarios
router.use('/comments', commentRoutes);

// Rutas de archivos
router.use('/files', fileRoutes);

module.exports = router; 