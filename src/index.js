import dotenv from 'dotenv';
import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';

dotenv.config();

const startServer = async () => {
  try {
    await initMongoConnection();
    setupServer();
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();
