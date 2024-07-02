const Sequelize = require('sequelize');

const sequelize = new Sequelize('nodejs', 'root', 'MYSQLl0g!n', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;



