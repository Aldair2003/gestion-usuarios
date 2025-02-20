const { Sequelize } = require('sequelize');
const config = require('../config/config')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        dialect: config.dialect,
        logging: config.logging
    }
);

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Importar modelos
db.User = require('./User')(sequelize);
db.Role = require('./Role')(sequelize);

// Definir relaciones
db.User.belongsTo(db.Role, { foreignKey: 'roleId' });
db.Role.hasMany(db.User, { foreignKey: 'roleId' });

// Inicializar modelos
db.Case = require('./Case')(sequelize);
db.Comment = require('./Comment')(sequelize);
db.File = require('./File')(sequelize);

// Configurar relaciones
db.Case.belongsTo(db.User, { foreignKey: 'userId' });
db.User.hasMany(db.Case, { foreignKey: 'userId' });

db.Comment.belongsTo(db.Case, { foreignKey: 'caseId' });
db.Case.hasMany(db.Comment, { foreignKey: 'caseId' });

db.Comment.belongsTo(db.User, { foreignKey: 'userId' });
db.User.hasMany(db.Comment, { foreignKey: 'userId' });

db.File.belongsTo(db.Case, { foreignKey: 'caseId' });
db.Case.hasMany(db.File, { foreignKey: 'caseId' });

db.File.belongsTo(db.User, { foreignKey: 'userId' });
db.User.hasMany(db.File, { foreignKey: 'userId' });

module.exports = db;
