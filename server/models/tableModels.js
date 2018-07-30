const Sequelize = require('sequelize');
const db = require('../db/db');

const User = db.define('user', {
  name: Sequelize.STRING,
  email: Sequelize.STRING,
  cam: Sequelize.BOOLEAN
});

module.exports = { User };
