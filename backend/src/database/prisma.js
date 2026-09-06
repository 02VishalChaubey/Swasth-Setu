const mockStore = require('./mockStore');
const logger = require('../utils/logger');

let prismaClient = null;

try {
  const { PrismaClient } = require('@prisma/client');
  prismaClient = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error']
  });
} catch (err) {
  logger.warn('PrismaClient not pre-generated; fallback in-memory mock repository initialized.', { message: err.message });
}

module.exports = {
  prisma: prismaClient,
  mockStore
};
