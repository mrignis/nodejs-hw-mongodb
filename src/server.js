/* eslint-disable no-unused-vars */
import express from 'express';
import pino from 'pino-http';
import cors from 'cors';

const PORT = process.env.PORT || 3000;

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  // Обробка маршруту /contacts
  app.get('/contacts', (_req, res) => {
    // Приклад: отримання всіх контактів
    const contacts = []; 
    res.json({
      status: 'success',
      message: 'Successfully found contacts!',
      data: contacts,
    });
  });

  app.use('*', function (req, res, next) {
      res.status(404).json({
        message: 'Not found',
      });
    });

  app.use((err, req, res, ) => {
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
