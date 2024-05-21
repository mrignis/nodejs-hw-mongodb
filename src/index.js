// src/index.js
import setupServer from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';

initMongoConnection();
setupServer();
