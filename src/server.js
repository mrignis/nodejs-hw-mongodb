/* eslint-disable no-unused-vars */
import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import contactRoutes from './routes/contactRoutes.js';

const setupServer = () => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(pino());

  // Routes
  app.use('/contacts', contactRoutes);

  // Not found route handler
  app.use((req, res, next) => {
    res.status(404).json({ message: 'Not found' });
  });

  // Error handler
  app.use((err, req, res, ) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
  });

  // Port
  const PORT = process.env.PORT || 3000;

  // Start server
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

export { setupServer };
