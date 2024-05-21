// src/db/initMongoConnection.js
import mongoose from 'mongoose';
import pino from 'pino';

const logger = pino();

export const initMongoConnection = async () => {
  try {
    // Зчитуємо змінні оточення для підключення до бази даних MongoDB
    const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } = process.env;
    
    // Формуємо URL для підключення до бази даних
    const url = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;
    
    // Підключаємося до бази даних
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    // Логуємо успішне підключення
    logger.info('Mongo connection successfully established!');
  } catch (error) {
    // Логуємо помилку підключення
    logger.error('Error connecting to MongoDB:', error.message);
  }
};
