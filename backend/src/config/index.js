require('dotenv').config();

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  databaseUrl: process.env.DATABASE_URL || 'postgresql://swasth_user:swasth_pass_2026@localhost:5432/swasth_setu_db?schema=public',
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'swasth_setu_jwt_access_secret_sih_2026_super_secure_key',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'swasth_setu_jwt_refresh_secret_sih_2026_long_lived_key',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRATION || '1h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
  },
  aiServiceUrl: process.env.AI_SERVICE_URL || 'http://localhost:8000',
  cors: {
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:3000', 'http://localhost:5173'],
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 200,
  }
};
