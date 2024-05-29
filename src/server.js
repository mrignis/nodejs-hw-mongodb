import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { env } from './db/env.js';
import router from './routes/contact.js';
import {
  getAllContactsService,
  getContactByIdService,
  createContactService,
  updateContactService,
  deleteContactService
} from './services/contact.js';
import errorHandler from './middlewares/errorHandler.js'; // Доданий імпорт
import notFoundHandler from './middlewares/notFoundHandler.js';

dotenv.config();

const PORT = Number(env('PORT', '3000'));

export const setupServer = () => {
  const app = express();

  app.use(
    express.json({
      type: ['application/json', 'application/vnd.api+json'],
      limit: '250kb',
    }),
  );

  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  // Реєстрація роутера для контактів
  app.use('/contacts', router);

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

  // Маршрут для створення нового контакту
  app.post('/newContact', async (req, res) => {
    try {
      const newContact = await createContactService(req.body);
      res.status(201).json({
        status: 201,
        message: 'Contact created successfully',
        data: newContact,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: 'Failed to create contact',
        error: error.message,
      });
    }
  });

  // Маршрут для оновлення існуючого контакту
  app.put('/contacts/:contactId', async (req, res) => {
    const { contactId } = req.params;
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;

    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return res.status(400).json({
        status: 400,
        message: 'Invalid contact ID format',
      });
    }

    try {
      const updatedContact = await updateContactService(contactId, {
        name,
        phoneNumber,
        email,
        isFavourite,
        contactType
      });
      res.status(200).json({
        status: 200,
        message: 'Contact updated successfully',
        data: updatedContact,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: 'Failed to update contact',
        error: error.message,
      });
    }
  });

  // Маршрут для видалення контакту
  app.delete('/contacts/:contactId', async (req, res) => {
    const { contactId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return res.status(400).json({
        status: 400,
        message: 'Invalid contact ID format',
      });
    }

    try {
      const deletedContact = await deleteContactService(contactId);
      res.status(200).json({
        status: 200,
        message: 'Contact deleted successfully',
        data: deletedContact,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: 'Failed to delete contact',
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
