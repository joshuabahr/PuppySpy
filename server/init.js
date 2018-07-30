const db = require('./db/db');
const Table = require('./models/tableModels');

const init = () =>
  db
    .authenticate()
    .then(() => Table.User.sync())
    .then(() => console.log('successfully synced with database'))
    .catch(err => console.error('error syncing with database', err));
module.exports = init;
