const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const commentController = require('../controllers/commentController');

// Obtener comentarios de un caso
router.get('/case/:caseId', auth, commentController.getComments);

// Crear un comentario
router.post('/', auth, commentController.createComment);

// Actualizar un comentario
router.put('/:id', auth, commentController.updateComment);

// Eliminar un comentario
router.delete('/:id', auth, commentController.deleteComment);

module.exports = router; 