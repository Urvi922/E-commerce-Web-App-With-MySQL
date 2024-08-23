const Sequelize = require('sequelize');

// const sequelize = new Sequelize('nodejs', 'root', 'MYSQLl0g!n', {
//     dialect: 'mysql',
//     host: 'localhost'
// });

const sequelize = new Sequelize('ROOT_NAME', 'NAME', 'PASSWORD', {
    dialect: 'DIALECT',
    host: 'HOST'
});

module.exports = sequelize;



