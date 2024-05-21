import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection';

const startServer = async () => {
  await initMongoConnection();
  setupServer();
};

startServer();
