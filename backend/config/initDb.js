const { Role, User } = require('../models');
const bcryptjs = require('bcryptjs');

const initializeDb = async () => {
    try {
        // Crear roles
        const roles = ['admin', 'user'];
        for (const roleName of roles) {
            await Role.findOrCreate({
                where: { name: roleName }
            });
        }
        console.log('✅ Roles creados correctamente');

        // Crear usuario admin por defecto
        const adminRole = await Role.findOne({ where: { name: 'admin' } });
        const adminExists = await User.findOne({
            where: { email: 'admin@example.com' }
        });

        if (!adminExists && adminRole) {
            const hashedPassword = await bcryptjs.hash('admin123', 10);
            await User.create({
                username: 'admin',
                email: 'admin@example.com',
                password: hashedPassword,
                roleId: adminRole.id
            });
            console.log('✅ Usuario admin creado correctamente');
        }
    } catch (error) {
        console.error('❌ Error al inicializar la base de datos:', error);
        throw error;
    }
};

module.exports = initializeDb; 