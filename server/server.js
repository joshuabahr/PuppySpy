const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');

const app = express();
const server = require('http').Server(app);

const router = require('./router');
const init = require('./init');

const port = 3333;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, '../public')));
app.use('/api', router);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

init()
  .then(() => {
    server.listen(process.env.PORT || port, () => {
      console.log(`app is listening on http://localhost:${port}`);
    });
  })
  .catch(err => console.error('unable to connect to database ', err));
