import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import {env} from './db/env.js';
import contactsRouter from './routes/contact.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import { getAllContactsService, getContactByIdService } from './services/contact.js';

dotenv.config();

const PORT = Number(env('PORT', '3000'));
export const setupServer = () => {
  const app = express();

  app.use(
    express.json({
      type: ['application/json', 'application/vnd.api+json'],
      limit: '100kb',
    }),
  );

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  // Реєстрація роутера для контактів
  app.use('/contacts', contactsRouter);

  // Обробка маршруту для отримання всіх контактів
  app.get('/contacts', async (req, res) => {
    try {
      const contacts = await getAllContactsService();
      res.status(200).json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: error.message,
      });
    }
  });

  // Обробка маршруту для отримання контакту за ID
  app.get('/contacts/:contactId', async (req, res) => {
    const { contactId } = req.params;

    // Перевірка на дійсний ObjectId
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return res.status(400).json({
        status: 400,
        message: 'Invalid contact ID format',
      });
    }

    try {
      const contact = await getContactByIdService(contactId);
      if (!contact) {
        return res.status(404).json({
          status: 404,
          message: `Contact with id ${contactId} not found`,
        });
      }
      res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: `Failed to retrieve contact with id ${contactId}`,
        error: error.message,
      });
    }
  });

  // Обробка неіснуючих маршрутів
  app.use('*', notFoundHandler);

  // Загальний обробник помилок
  app.use(errorHandler);

  // Запуск сервера
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
