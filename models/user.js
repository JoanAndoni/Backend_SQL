import { DataTypes } from 'sequelize';
import db from '../config/database';

const User = db.define('Users', {
    username: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
}, {
    freezeTableName: true,
});

module.exports = User;