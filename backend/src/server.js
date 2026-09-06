const app = require('./app');
const config = require('./config');
const logger = require('./utils/logger');

const server = app.listen(config.port, '0.0.0.0', () => {
  logger.info(`=======================================================`);
  logger.info(`SWASTH SETU - RURAL HEALTH PORTAL REST API GATEWAY`);
  logger.info(`Smart India Hackathon 2026 Production Backend`);
  logger.info(`Running on port: ${config.port}`);
  logger.info(`Environment: ${config.env}`);
  logger.info(`Swagger API Docs: http://localhost:${config.port}/api/docs`);
  logger.info(`Health Endpoint: http://localhost:${config.port}/api/health`);
  logger.info(`AI Triage Engine: ${config.aiServiceUrl}`);
  logger.info(`=======================================================`);
});

// Graceful termination handling
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Process terminated.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down...');
  server.close(() => {
    process.exit(0);
  });
});

module.exports = server;
