#!/usr/bin/env node

import BackendApp from '@backend/backend_app';

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
