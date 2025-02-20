const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');
const { Op } = require('sequelize');

const userController = {
    // Registro de usuario
    register: async (req, res) => {
        try {
            const { username, email, password } = req.body;
            
            // Validaciones
            if (!username || !email || !password) {
                return res.status(400).json({
                    message: 'Todos los campos son requeridos'
                });
            }

            // Verificar si el email ya existe
            const existingUser = await User.findOne({ 
                where: { email }
            });

            if (existingUser) {
                return res.status(400).json({
                    message: 'El correo electrónico ya está registrado'
                });
            }

            // Verificar que exista el rol por defecto (user)
            const userRole = await Role.findOne({ where: { name: 'user' } });
            if (!userRole) {
                // Crear el rol si no existe
                await Role.create({ name: 'user' });
            }

            // Crear usuario - la contraseña se hasheará automáticamente por el hook
            const user = await User.create({
                username,
                email,
                password, // No hashear aquí, el hook se encargará
                roleId: 2 // ID del rol 'user'
            });

            const token = jwt.sign(
                { 
                    id: user.id,
                    email: user.email,
                    role: 'user'
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.status(201).json({
                message: 'Usuario registrado exitosamente',
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: 'user'
                },
                token
            });

        } catch (error) {
            console.error('Error en registro:', error);
            res.status(500).json({
                message: 'Error al registrar usuario'
            });
        }
    },

    // Login de usuario
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            
            console.log('Intento de login:', { email });

            const user = await User.findOne({
                where: { email },
                include: [{
                    model: Role,
                    attributes: ['name']
                }]
            });

            console.log('Usuario encontrado:', user ? user.toJSON() : null);

            if (!user) {
                return res.status(401).json({
                    message: 'Credenciales inválidas'
                });
            }

            // Usar el método del modelo para validar la contraseña
            const isValidPassword = await user.validatePassword(password);
            console.log('¿Contraseña válida?:', isValidPassword);

            if (!isValidPassword) {
                return res.status(401).json({
                    message: 'Credenciales inválidas'
                });
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    role: user.Role.name
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.Role.name
                }
            });

        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({
                message: 'Error en el servidor',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    // Obtener perfil de usuario
    getProfile: async (req, res) => {
        try {
            const user = await User.findByPk(req.user.id, {
                attributes: { exclude: ['password'] },
                include: [{
                    model: Role,
                    attributes: ['name']
                }]
            });

            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            res.json({
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.Role?.name || 'user',
                createdAt: user.createdAt
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Obtener todos los usuarios
    getUsers: async (req, res) => {
        try {
            const users = await User.findAll({
                attributes: ['id', 'username', 'email'],
                include: [{ 
                    model: Role,
                    attributes: ['name']
                }]
            });

            res.json(users);
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            res.status(500).json({
                message: 'Error al obtener usuarios'
            });
        }
    },

    // Obtener un usuario específico
    getUser: async (req, res) => {
        try {
            const user = await User.findByPk(req.params.id, {
                attributes: ['id', 'username', 'email', 'roleId'],
                include: [{
                    model: Role,
                    attributes: ['name']
                }]
            });
            
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            // Formatear la respuesta
            const userResponse = {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.Role?.name || 'user'
            };

            res.json(userResponse);
        } catch (error) {
            console.error('Error al obtener usuario:', error);
            res.status(500).json({ message: 'Error al obtener usuario' });
        }
    },

    // Actualizar usuario
    updateUser: async (req, res) => {
        try {
            const { username, email, password, role } = req.body;
            const { id } = req.params;

            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            // Verificar email único si se está cambiando
            if (email && email !== user.email) {
                const existingUser = await User.findOne({
                    where: { 
                        email,
                        id: { [Op.ne]: id }
                    }
                });
                if (existingUser) {
                    return res.status(400).json({ message: 'El correo electrónico ya está en uso' });
                }
            }

            // Preparar datos para actualizar
            const updateData = {};
            if (username) updateData.username = username;
            if (email) updateData.email = email;
            if (role) {
                const roleRecord = await Role.findOne({ where: { name: role } });
                if (roleRecord) {
                    updateData.roleId = roleRecord.id;
                }
            }

            // Si hay contraseña nueva, hashearla
            if (password) {
                const salt = await bcryptjs.genSalt(10);
                updateData.password = await bcryptjs.hash(password, salt);
            }

            // Actualizar usuario
            await user.update(updateData);

            // Obtener el usuario actualizado con su rol
            const updatedUser = await User.findByPk(id, {
                include: [{
                    model: Role,
                    attributes: ['name']
                }]
            });

            // Formatear respuesta
            const userResponse = {
                id: updatedUser.id,
                username: updatedUser.username,
                email: updatedUser.email,
                role: updatedUser.Role?.name || 'user'
            };

            res.json(userResponse);
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            res.status(500).json({ message: 'Error al actualizar usuario' });
        }
    },

    // Eliminar usuario
    deleteUser: async (req, res) => {
        try {
            const user = await User.findByPk(req.params.id);
            
            if (!user) {
                return res.status(404).json({ 
                    message: 'Usuario no encontrado' 
                });
            }

            // Evitar que se elimine el usuario admin principal
            if (user.role === 'admin' && user.email === 'admin@example.com') {
                return res.status(403).json({
                    message: 'No se puede eliminar el usuario administrador principal'
                });
            }

            await user.destroy();
            res.json({ 
                message: 'Usuario eliminado exitosamente' 
            });
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            res.status(500).json({ 
                message: 'Error al eliminar usuario' 
            });
        }
    }
};

module.exports = userController; 