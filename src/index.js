// src/index.js
const setupServer = require('./server');
const { initMongoConnection } = require('./db/initMongoConnection');

initMongoConnection();
setupServer();
