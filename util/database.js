const Sequelize = require('sequelize');

const sequelize = new Sequelize('Node-Ecommerce', 'root', 'ker998Ns', {dialect: 'mysql', host: 'localhost'});

module.exports = sequelize;