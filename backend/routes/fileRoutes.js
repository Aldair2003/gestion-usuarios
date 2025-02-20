const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const { File, Case } = require('../models');
const fileController = require('../controllers/fileController');

// Configurar multer para almacenamiento de archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Ruta para subir archivo
router.post('/upload', auth, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No se subió ningún archivo' });
        }

        res.json({
            message: 'Archivo subido correctamente',
            filename: req.file.filename
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Subir archivo a un caso
router.post('/case/:caseId', auth, upload.single('file'), async (req, res) => {
    try {
        const case_ = await Case.findByPk(req.params.caseId);
        if (!case_) {
            return res.status(404).json({ message: 'Caso no encontrado' });
        }

        const file = await File.create({
            filename: req.file.filename,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            path: req.file.path,
            caseId: req.params.caseId,
            userId: req.user.id
        });

        res.status(201).json({
            message: 'Archivo subido exitosamente',
            file
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Obtener archivos de un caso
router.get('/case/:caseId', auth, async (req, res) => {
    try {
        const files = await File.findAll({
            where: { caseId: req.params.caseId },
            include: [{
                model: User,
                attributes: ['username']
            }]
        });
        res.json(files);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Descargar archivo
router.get('/:id', auth, async (req, res) => {
    try {
        const file = await File.findByPk(req.params.id);
        if (!file) {
            return res.status(404).json({ message: 'Archivo no encontrado' });
        }
        res.download(file.path, file.originalname);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Eliminar archivo
router.delete('/:id', auth, async (req, res) => {
    try {
        const file = await File.findByPk(req.params.id);
        if (!file) {
            return res.status(404).json({ message: 'Archivo no encontrado' });
        }

        // Verificar permisos
        if (file.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'No autorizado' });
        }

        await file.destroy();
        res.json({ message: 'Archivo eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Rutas para archivos
router.get('/', auth, fileController.getFiles);
router.post('/upload', auth, upload.single('file'), fileController.uploadFile);
router.get('/:id', auth, fileController.getFile);
router.delete('/:id', auth, fileController.deleteFile);

module.exports = router; 