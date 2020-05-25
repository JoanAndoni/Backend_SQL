import { DataTypes } from 'sequelize';
import db from '../config/database';
import bcrypt from 'bcryptjs';

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


module.exports.comparePassword = (candidatePassword, hash, callback) => {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
}