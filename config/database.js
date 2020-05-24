import * as config from './variables';
import Sequelize from 'sequelize';

module.exports = new Sequelize(config.bdConfig.database, config.bdConfig.username, config.bdConfig.password, {
    host: 'localhost',
    dialect: 'postgres'
});

