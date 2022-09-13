var createError = require('http-errors');
var debug = require('debug')('src:server');
var expressWs = require('express-ws')
var express = require('express');
var http = require('http');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var loggingRouter = require('./routes/logging');
var quickdrawRouter = require('./routes/quickdraw');
var interpretationsRouter = require('./routes/interpretations');
var imagesRouter = require('./routes/images');
var imageIntersectRouter = require('./routes/imageIntersection');

var port = normalizePort(process.env.PORT || '3000');
var app = express();
var server = http.createServer(app);
var wsInstance = expressWs(app, server);
var wss = wsInstance.getWss();

app.set('port', port);
server.on('error', onError);
server.on('listening', onListening);

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'static')));

// view engine setup - used for templating
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

var categoriesRouter = require('./routes/categories');
var echoRouter = require('./routes/echo')(express.Router());
var interpretationsRouter = require('./routes/interpretations');
var imagesRouter = require('./routes/images');
var loggingRouter = require('./routes/logging');
var myscriptRouter = require('./routes/myscript');
var quickdrawRouter = require('./routes/quickdraw');
var wizardRouter = require('./routes/wizard')(express.Router());

app.use('/categories', categoriesRouter);
app.use('/echo', echoRouter);
app.use('/logging', loggingRouter);
app.use('/myscript', myscriptRouter);
app.use('/quickdraw', quickdrawRouter);
app.use('/interpretations', interpretationsRouter);
app.use('/images', imagesRouter);
app.use('/wizard', wizardRouter);
app.use('/imageIntersection', imageIntersectRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Normalize a port into a number, string, or false.
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

// Event listener for HTTP server "error" event.
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
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
    default:
      throw error;
  }
}

// Event listener for HTTP server "listening" event.
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

// Setup heartbeating for WebSocket connections.
const interval = setInterval(function ping() {
  // console.log("Sending pings.")
  wss.clients.forEach(function each(ws) {
    // console.log(" - Pinging socket.",)
    ws.send(JSON.stringify({ type: "heartbeat" }));
  });
}, 30000);

wss.on('close', function close() {
  clearInterval(interval);
});

server.listen(port);
