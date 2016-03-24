#!/usr/bin/env node

const express = require('express'),
      path = require('path'),
      logger = require('morgan'),
      cookieParser = require('cookie-parser'),
      bodyParser = require('body-parser'),
      favicon = require('serve-favicon');

const app = express(),
      debug = require('debug')('supermoon:server'),
      server = require('http').Server(app);

const port = process.argv[2] || process.env.PORT || '3000';
app.set('port', port);

// view engine setup
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'ejs');

app.use(favicon(`${__dirname}/static/img/favicon.ico`));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/static', express.static(path.join(__dirname, 'static')));

app.use('/stream', require('./routes/stream'));
app.use('/', require('./routes/pages'));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', { message: err.message, error: err });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', { message: err.message, error: err });
});

server.on('error', (error) => {
  if (error.syscall !== 'listen') throw error;
  var bind = (typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port);
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

server.on('listening', () => {
  var addr = server.address(),
      bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug(`Listening on ${bind}`);
});

server.listen(port);
