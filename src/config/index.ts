import dotenv from 'dotenv'
import path from 'path'

// Load all environment variables from .env file
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const config = {
  environment: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI || '',
};

export default config;
