require('dotenv').config();
const cors = require('cors');
const express = require('express');
const routes = require('./routes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swagger');

// Initialize express app
const app = express();

app.use(cors({
  // Dynamically allow frontend origin(s) via env
  // FRONTEND_ORIGIN takes precedence; REACT_APP_FRONTEND_URL is used as fallback if present.
  // If neither are set, default to dev-safe localhost origins on port 3001.
  origin: (function () {
    const envFrontendOrigin = (process.env.FRONTEND_ORIGIN || '').trim();
    const envReactFrontendUrl = (process.env.REACT_APP_FRONTEND_URL || '').trim();
    const defaultDevOrigins = ['http://localhost:3001', 'http://0.0.0.0:3001'];

    function parseOrigins(val) {
      return val.split(',').map(s => s.trim()).filter(Boolean);
    }

    let allowedOrigins = [];
    if (envFrontendOrigin) {
      allowedOrigins = parseOrigins(envFrontendOrigin);
    } else if (envReactFrontendUrl) {
      allowedOrigins = parseOrigins(envReactFrontendUrl);
    } else {
      allowedOrigins = defaultDevOrigins;
    }

    // Return an origin function for fine-grained control
    return function (origin, callback) {
      // Allow non-browser requests (no Origin header) such as curl or health checks
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      // Not allowed: proceed without CORS headers
      return callback(null, false);
    };
  })(),
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false,
  optionsSuccessStatus: 204
}));
app.set('trust proxy', true);
app.use('/docs', swaggerUi.serve, (req, res, next) => {
  const host = req.get('host');           // may or may not include port
  let protocol = req.protocol;          // http or https

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
        url: `${protocol}://${fullHost}`,
      },
    ],
  };
  swaggerUi.setup(dynamicSpec)(req, res, next);
});

// Parse JSON request body
app.use(express.json());

// Mount routes
app.use('/', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
});

module.exports = app;
