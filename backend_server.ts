#!/usr/bin/env node

/**
 * Module dependencies.
 */

import BackendApp from "@backend/backend_app";
//  var debug = require('debug')('src:server');
//  var http = require('http');
 
function normalizePort(val: string): number | undefined {
  var port = parseInt(val, 10);

  if (!isNaN(port) && port >= 0) {
    return port;
  }

  return undefined;
}
 

const port = normalizePort(process.env['PORT'] || '3000');
if (!port) {
  console.error(`Port must be a number!`);
  process.exit(1);
}
let backendApp = new BackendApp(port);
backendApp.startServer();
backendApp.listen();
 
 /**
  * Create HTTP server.
  */
 
 // var server = http.createServer(app);
 
 /**
  * Listen on provided port, on all network interfaces.
  */
 
 // server.on('error', onError);
 // server.on('listening', onListening);
 
 /**
  * Normalize a port into a number, string, or false.
  */
 

 
 /**
  * Event listener for HTTP server "error" event.
  */
 
//  function onError(error) {
//    if (error.syscall !== 'listen') {
//      throw error;
//    }
 
//    var bind = typeof port === 'string'
//      ? 'Pipe ' + port
//      : 'Port ' + port;
 
//    // handle specific listen errors with friendly messages
//    switch (error.code) {
//      case 'EACCES':
//        console.error(bind + ' requires elevated privileges');
//        process.exit(1);
//      case 'EADDRINUSE':
//        console.error(bind + ' is already in use');
//        process.exit(1);
//      default:
//        throw error;
//    }
//  }
 
//  /**
//   * Event listener for HTTP server "listening" event.
//   */
 
//  function onListening() {
//    var addr = server.address();
//    var bind = typeof addr === 'string'
//      ? 'pipe ' + addr
//      : 'port ' + addr.port;
//    debug('Listening on ' + bind);
//  }