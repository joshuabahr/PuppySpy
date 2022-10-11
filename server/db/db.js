const Sequelize = require('sequelize');
const config = require('../../config');

const db = new Sequelize(config.dbURL, {
  dialect: 'postgres',

  pool: {
    max: 1,
    min: 0,
    idle: 10000
  }
});

module.exports = db;
