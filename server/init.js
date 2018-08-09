const db = require('./db/db');
const Table = require('./models/tableModels');

// to force refresh database, set dropDB to true
// !!!! all data will be lost !!!!
const dropDB = false;


// init function initiates connection to databases prior to server start
const init = () => {

  const refresh = dropDB ? { force: true } : null;
  
  return (
    db
    .authenticate()
    .then(() => Table.User.sync(refresh))
    .then(() => Table.Cam.sync(refresh))
    .then(() => Table.User_Cam.sync(refresh))
    .then(() => console.log('successfully synced with database'))
    .catch(err => console.error('error syncing with database', err))
  )
  
}

module.exports = init;
