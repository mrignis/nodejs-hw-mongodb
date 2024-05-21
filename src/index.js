import { setupServer } from './server';
import { initMongoConnection } from './db/initMongoConnection';

const startServer = async () => {
  await initMongoConnection();
  setupServer();
};

startServer();
