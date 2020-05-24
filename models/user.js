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

// module.exports.getUserByUsername = (username, callback) => {
//     const query = {
//         username: username
//     }
//     User.findOne(query, callback);
// }

// module.exports.addUser = (newUser, callback) => {
    // bcrypt.hash(newUser.password, saltRounds, (err, hash) => {
    //     if (err) throw err;
    //     newUser.password = hash;
    //     newUser.save(callback);
    // });
// }

// module.exports.comparePassword = (candidatePassword, hash, callback) => {
//     bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
//         if (err) throw err;
//         callback(null, isMatch);
//     });
// }