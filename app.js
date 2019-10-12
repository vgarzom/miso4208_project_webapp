var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
const http = require('http');
var logger = require('morgan');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

const db_connection = process.env.miso4208_exam1_db;

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 'extended': 'false' }));

app.use(express.static(path.join(__dirname, 'dist')));
app.use("/testcases", express.static(path.join(__dirname, 'testcases')));
app.use("/public", express.static('public'));

//Loading api routes
app.use("/api", require('./api/routes'));

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// Mongoose configuration
mongoose.Promise = require('bluebird');

mongoose.connect(db_connection, { useNewUrlParser: true, promiseLibrary: require('bluebird') })
  .then(() => console.log('connection to database succesful'))
  .catch((err) => console.error(err));

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '8081';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}
