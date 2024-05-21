const { setupServer } = require('./server');
const { initMongoConnection } = require('./db/initMongoConnection');

const startServer = async () => {
  await initMongoConnection();
  setupServer();
};

startServer();
