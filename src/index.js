import { setupServer } from './server.js';
import { initMongoConnection } from '../src/db/initMongoConnection.js';

const startServer = async () => {
  await initMongoConnection();
  setupServer();
};

startServer();
