const { Case, User } = require('../models');
const { Op } = require('sequelize');

const caseController = {
    // Obtener todos los casos
    getCases: async (req, res) => {
        try {
            const { status, search, startDate, endDate } = req.query;
            const where = { userId: req.user.id };

            if (status) where.status = status;
            if (search) {
                where[Op.or] = [
                    { title: { [Op.iLike]: `%${search}%` } },
                    { description: { [Op.iLike]: `%${search}%` } }
                ];
            }
            if (startDate && endDate) {
                where.createdAt = {
                    [Op.between]: [startDate, endDate]
                };
            }

            const cases = await Case.findAll({
                where,
                include: [{
                    model: User,
                    attributes: ['username', 'email']
                }],
                order: [['createdAt', 'DESC']]
            });

            res.json(cases);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Obtener un caso por ID
    getCase: async (req, res) => {
        try {
            const case_ = await Case.findOne({
                where: { 
                    id: req.params.id,
                    userId: req.user.id
                },
                include: [{ 
                    model: User,
                    attributes: ['username', 'email']
                }]
            });
            
            if (!case_) {
                return res.status(404).json({ message: 'Caso no encontrado' });
            }
            res.json(case_);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Crear un nuevo caso
    createCase: async (req, res) => {
        try {
            const { title, description, status } = req.body;

            if (!title || !description) {
                return res.status(400).json({ 
                    message: 'El título y la descripción son requeridos' 
                });
            }

            const newCase = await Case.create({
                title,
                description,
                status: status || 'pending',
                userId: req.user.id
            });

            res.status(201).json({
                message: 'Caso creado exitosamente',
                case: newCase
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Actualizar un caso
    updateCase: async (req, res) => {
        try {
            const case_ = await Case.findOne({
                where: { 
                    id: req.params.id,
                    userId: req.user.id
                }
            });

            if (!case_) {
                return res.status(404).json({ message: 'Caso no encontrado' });
            }

            await case_.update(req.body);
            res.json(case_);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Eliminar un caso
    deleteCase: async (req, res) => {
        try {
            const case_ = await Case.findOne({
                where: { 
                    id: req.params.id,
                    userId: req.user.id
                }
            });

            if (!case_) {
                return res.status(404).json({ message: 'Caso no encontrado' });
            }

            await case_.destroy();
            res.json({ message: 'Caso eliminado correctamente' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = caseController; 