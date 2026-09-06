const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const config = require('./config');
const apiRoutes = require('./routes');
const swaggerDoc = require('./docs/swagger.json');
const { generalLimiter } = require('./middleware/rateLimiter.middleware');
const { notFoundHandler, errorHandler } = require('./middleware/error.middleware');

const app = express();

// Security HTTP headers
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// CORS Configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// HTTP Request Logging
if (config.env !== 'test') {
  app.use(morgan('combined'));
}

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Global Rate Limiter
app.use('/api', generalLimiter);

// Interactive OpenAPI / Swagger Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Swasth Setu API Documentation (SIH 2026)'
}));

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Mount Main API Router
app.use('/api', apiRoutes);

// Catch 404
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
