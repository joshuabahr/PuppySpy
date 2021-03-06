const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const webpack = require('webpack');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const config = require('../webpack.config');
const router = require('./router');
const init = require('./init');
const socketEvents = require('./socketEvents');

socketEvents(io);

const compiler = webpack(config);
const port = 3333;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use(
  require('webpack-dev-middleware')(compiler, {
    noInfo: true
  })
);

app.use(require('webpack-hot-middleware')(compiler));

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
