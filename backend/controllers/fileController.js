const { File, User, Case } = require('../models');
const fs = require('fs').promises;
const path = require('path');

const fileController = {
    getFiles: async (req, res) => {
        try {
            const files = await File.findAll({
                include: [{
                    model: User,
                    attributes: ['username']
                }, {
                    model: Case,
                    attributes: ['title']
                }],
                order: [['createdAt', 'DESC']]
            });
            res.json(files);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    uploadFile: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No se subió ningún archivo' });
            }

            const file = await File.create({
                filename: req.file.filename,
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size,
                path: req.file.path,
                userId: req.user.id,
                caseId: req.body.caseId
            });

            res.status(201).json({
                message: 'Archivo subido exitosamente',
                file
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    getFile: async (req, res) => {
        try {
            const file = await File.findByPk(req.params.id);
            if (!file) {
                return res.status(404).json({ message: 'Archivo no encontrado' });
            }
            res.download(file.path, file.originalname);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    deleteFile: async (req, res) => {
        try {
            const file = await File.findByPk(req.params.id);
            if (!file) {
                return res.status(404).json({ message: 'Archivo no encontrado' });
            }

            // Verificar permisos
            if (file.userId !== req.user.id && req.user.roleId !== 1) {
                return res.status(403).json({ message: 'No autorizado' });
            }

            // Eliminar el archivo físico
            await fs.unlink(file.path);

            // Eliminar el registro de la base de datos
            await file.destroy();
            res.json({ message: 'Archivo eliminado correctamente' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = fileController; 