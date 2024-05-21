import express from 'express';
import cors from 'cors';
import pino from 'pino';
import { getContacts, getContact } from './controllers/contacts.js';
import dotenv from 'dotenv';

dotenv.config();

const setupServer = () => {
  const app = express();
  const logger = pino();

  app.use(cors());
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
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

export { setupServer };
