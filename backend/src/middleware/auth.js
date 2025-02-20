const jwt = require('jsonwebtoken');
const { User } = require('../models/User');

exports.protect = async (req, res, next) => {
    try {
        // Verificar token
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No autorizado' });
        }

        // Verificar validez del token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Obtener usuario
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Error en autenticación:', error);
        res.status(401).json({ message: 'Token inválido' });
    }
}; 