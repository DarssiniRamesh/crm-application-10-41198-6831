/**
 * Server entrypoint for the Express app.
 * - Forces deterministic bind to 0.0.0.0:3000 via npm scripts (overrides .env).
 * - Logs effective host/port on startup.
 * - Performs readiness self-checks for '/', '/health', and '/api/v1/health'.
 */

const http = require('http'); // for readiness probes
const app = require('./app');

const DEFAULT_PORT = 3000;
const DEFAULT_HOST = '0.0.0.0';

// Determine effective host and port.
// Start script sets HOST/PORT explicitly to override any .env values.
const PORT = Number(process.env.PORT) || DEFAULT_PORT;
const HOST = process.env.HOST || DEFAULT_HOST;

const server = app.listen(PORT, HOST, () => {
  const env = process.env.NODE_ENV || 'development';
  // eslint-disable-next-line no-console
  console.log(`[startup] Express server listening | env=${env} host=${HOST} port=${PORT}`);

  // Readiness probes: check '/', '/health', and '/api/v1/health'
  const paths = ['/', '/health', '/api/v1/health'];
  paths.forEach((p) => {
    http
      .get({ host: '127.0.0.1', port: PORT, path: p }, (res) => {
        // eslint-disable-next-line no-console
        console.log(`[readiness] GET ${p} -> ${res.statusCode}`);
        res.resume();
      })
      .on('error', (err) => {
        // eslint-disable-next-line no-console
        console.error(`[readiness] GET ${p} failed: ${err.message}`);
      });
  });
});

// Server error handling (e.g., EADDRINUSE)
server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    // eslint-disable-next-line no-console
    console.error(`Port ${PORT} is already in use. Ensure no other process is listening on this port.`);
  } else {
    // eslint-disable-next-line no-console
    console.error('HTTP server error:', err);
  }
  process.exit(1);
});

// Graceful shutdown handling
const shutdown = () => {
  // eslint-disable-next-line no-console
  console.log('Shutdown signal received: closing HTTP server');
  server.close(() => {
    // eslint-disable-next-line no-console
    console.log('HTTP server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Handle unhandled async errors to avoid silent failures
process.on('unhandledRejection', (reason, promise) => {
  // eslint-disable-next-line no-console
  console.error('[fatal] Unhandled promise rejection:', reason);
});

process.on('uncaughtException', (err) => {
  // eslint-disable-next-line no-console
  console.error('[fatal] Uncaught exception:', err);
  process.exit(1);
});

module.exports = server;
