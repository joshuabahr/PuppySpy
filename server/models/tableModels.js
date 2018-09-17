const Sequelize = require('sequelize');
const db = require('../db/db');

const User = db.define('user', {
  name: Sequelize.STRING,
  email: Sequelize.STRING,
  phone: Sequelize.STRING
});

const Cam = db.define('cam', {
  camName: Sequelize.STRING,
  active: Sequelize.BOOLEAN,
  password: Sequelize.STRING
});

const User_Cam = db.define('user_cam', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }
});

const Blockphone = db.define('blockphone', {
  phone: Sequelize.STRING
})

User.hasMany(Cam);
Cam.belongsTo(User);

/* User.belongsToMany(Cam, {as: 'userId', through: User_Cam})
Cam.belongsToMany(User, {as: 'camId', through: User_Cam})
 */

User.hasMany(User_Cam);
User_Cam.belongsTo(User);

Cam.hasMany(User_Cam);
User_Cam.belongsTo(Cam);

module.exports = { User, Cam, User_Cam, Blockphone };
