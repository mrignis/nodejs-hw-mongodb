const express = require('express');
const cors = require('cors');
const pino = require('pino')();
const { getContacts, getContact } = require('./controllers/contacts');
require('dotenv').config();

const setupServer = () => {
  const app = express();
  app.use(cors());
  app.use((req, res, next) => {
    pino.info(`${req.method} ${req.url}`);
    next();
  });

  app.get('/contacts', getContacts);
  app.get('/contacts/:contactId', getContact);

  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

module.exports = { setupServer };
