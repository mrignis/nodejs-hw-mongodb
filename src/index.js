import dotenv from 'dotenv';
import setupServer from './server.js';
import initMongoConnection from './db/initMongoConnection.js';

dotenv.config();

(async () => {
    await initMongoConnection();
    setupServer();
})();
