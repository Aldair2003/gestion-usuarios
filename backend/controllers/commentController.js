const { Comment, User, Case } = require('../models');

const commentController = {
    getComments: async (req, res) => {
        try {
            const comments = await Comment.findAll({
                where: { caseId: req.params.caseId },
                include: [{
                    model: User,
                    attributes: ['username']
                }],
                order: [['createdAt', 'DESC']]
            });
            res.json(comments);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    createComment: async (req, res) => {
        try {
            const { content, caseId } = req.body;

            // Validar que el caso existe
            const case_ = await Case.findByPk(caseId);
            if (!case_) {
                return res.status(404).json({ message: 'Caso no encontrado' });
            }

            const comment = await Comment.create({
                content,
                caseId,
                userId: req.user.id
            });

            // Incluir datos del usuario en la respuesta
            const commentWithUser = await Comment.findByPk(comment.id, {
                include: [{
                    model: User,
                    attributes: ['username']
                }]
            });

            res.status(201).json({
                message: 'Comentario creado exitosamente',
                comment: commentWithUser
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    updateComment: async (req, res) => {
        try {
            const comment = await Comment.findByPk(req.params.id);
            
            if (!comment) {
                return res.status(404).json({ message: 'Comentario no encontrado' });
            }

            if (comment.userId !== req.user.id && req.user.roleId !== 1) { // 1 = admin
                return res.status(403).json({ message: 'No autorizado' });
            }

            await comment.update(req.body);
            res.json(comment);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    deleteComment: async (req, res) => {
        try {
            const comment = await Comment.findByPk(req.params.id);
            
            if (!comment) {
                return res.status(404).json({ message: 'Comentario no encontrado' });
            }

            // Solo el autor del comentario o un admin puede eliminarlo
            if (comment.userId !== req.user.id && req.user.roleId !== 1) {
                return res.status(403).json({ message: 'No autorizado' });
            }

            await comment.destroy();
            res.json({ message: 'Comentario eliminado correctamente' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = commentController; 