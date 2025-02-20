const { Model, DataTypes } = require('sequelize');
const bcryptjs = require('bcryptjs');

module.exports = (sequelize) => {
    class User extends Model {
        static associate(models) {
            User.belongsTo(models.Role, { foreignKey: 'roleId' });
        }

        // Método para validar contraseña
        async validatePassword(password) {
            return await bcryptjs.compare(password, this.password);
        }
    }

    User.init({
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        roleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 2 // 2 = user role
        }
    }, {
        sequelize,
        modelName: 'User',
        hooks: {
            // Hash la contraseña antes de crear o actualizar
            beforeSave: async (user) => {
                if (user.changed('password')) {
                    const salt = await bcryptjs.genSalt(10);
                    user.password = await bcryptjs.hash(user.password, salt);
                }
            }
        }
    });

    return User;
};
