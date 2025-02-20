const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const File = sequelize.define('Files', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        filename: {
            type: DataTypes.STRING,
            allowNull: false
        },
        originalname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        mimetype: {
            type: DataTypes.STRING,
            allowNull: false
        },
        size: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        path: {
            type: DataTypes.STRING,
            allowNull: false
        },
        caseId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Cases',
                key: 'id'
            }
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Users',
                key: 'id'
            }
        }
    }, {
        tableName: 'Files',
        timestamps: true
    });

    return File;
}; 