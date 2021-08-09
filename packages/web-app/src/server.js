const http = require('http');
const config = require('./config/config');
const app = require('./app');
const logger = require('./lib/logger');
const healthcheck = require('./lib/healthcheck');

const {
  server: { port },
} = config;

app.set('port', port);

const server = http.createServer(app);

healthcheck(server);

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  switch (error.code) {
    case 'EACCES':
      logger.error({ port }, `App requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error({ port }, `Port already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  logger.info({ config }, 'Listening!');
}

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
