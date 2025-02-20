const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const caseController = require('../controllers/caseController');
const { Case, User } = require('../models');
const { Op } = require('sequelize');

// Definir los controladores directamente en las rutas
router.get('/', auth, caseController.getCases);
router.get('/:id', auth, caseController.getCase);
router.post('/', auth, caseController.createCase);
router.put('/:id', auth, caseController.updateCase);
router.delete('/:id', auth, caseController.deleteCase);

router.get('/stats', auth, async (req, res) => {
    try {
        const totalCases = await Case.count({ where: { userId: req.user.id } });
        
        const byStatus = await Case.count({
            where: { userId: req.user.id },
            group: 'status'
        });

        const byPriority = await Case.count({
            where: { userId: req.user.id },
            group: 'priority'
        });

        res.json({
            total: totalCases,
            byStatus,
            byPriority
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
