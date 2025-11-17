require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const express = require('express');
const routes = require('./routes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swagger');
const healthController = require('./controllers/health');

// Initialize express app
const app = express();

// Security hardening
app.use(helmet());

// CORS configuration for specified origins only
app.use(cors({
  origin: [
    'https://vscode-internal-40318-beta.beta01.cloud.kavia.ai:3001',
    'http://localhost:3001',
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false,
  optionsSuccessStatus: 204,
}));

// Trust proxy if behind load balancers/reverse proxies
app.set('trust proxy', true);

// Swagger docs - dynamically set server to include /api/v1 base path
app.use('/docs', swaggerUi.serve, (req, res, next) => {
  const host = req.get('host'); // may or may not include port
  let protocol = req.protocol; // http or https

  const actualPort = req.socket.localPort;
  const hasPort = host.includes(':');

  const needsPort =
    !hasPort &&
    ((protocol === 'http' && actualPort !== 80) ||
      (protocol === 'https' && actualPort !== 443));
  const fullHost = needsPort ? `${host}:${actualPort}` : host;
  protocol = req.secure ? 'https' : protocol;

  const dynamicSpec = {
    ...swaggerSpec,
    servers: [
      {
        url: `${protocol}://${fullHost}/api/v1`,
      },
    ],
  };
  swaggerUi.setup(dynamicSpec)(req, res, next);
});

// Parse JSON request body
app.use(express.json());

// Root health endpoint remains available (no prefix)
app.get('/', healthController.check.bind(healthController));

// Mount routes under /api/v1
app.use('/api/v1', routes);

// Error handling middleware (standard Error schema)
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err && err.stack ? err.stack : err);
  const status = err && err.status ? err.status : 500;
  const code = status >= 500 ? 'internal_error' : 'error';
  res.status(status).json({
    code,
    message: status >= 500 ? 'Internal Server Error' : (err.message || 'Request failed'),
  });
});

module.exports = app;
