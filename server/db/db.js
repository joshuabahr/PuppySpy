const Sequelize = require('sequelize');

const db = new Sequelize(process.env.DB_URL, {
  dialect: 'postgres',
  operatorsAliases: Sequelize.Op,

  pool: {
    max: 1,
    min: 0,
    idle: 10000
  }
});

module.exports = db;
