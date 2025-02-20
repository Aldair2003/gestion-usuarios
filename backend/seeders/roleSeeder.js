const { Role } = require('../models');

async function seedRoles() {
    try {
        // Crear roles si no existen
        await Role.findOrCreate({
            where: { id: 1 },
            defaults: { name: 'admin' }
        });

        await Role.findOrCreate({
            where: { id: 2 },
            defaults: { name: 'user' }
        });

        console.log('Roles creados exitosamente');
    } catch (error) {
        console.error('Error al crear roles:', error);
    }
}

module.exports = seedRoles; 