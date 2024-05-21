// src/server.js
const express = require('express');
const pino = require('pino')();
const cors = require('cors');

const setupServer = () => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // 404 Not Found middleware
  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    pino.info(`Server is running on port ${PORT}`);
  });
};

module.exports = setupServer;
