// src/db/initMongoConnection.js
import mongoose from 'mongoose';

const initMongoConnection = async () => {
  const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } = process.env;
  
  // Формуємо URI для підключення до MongoDB
  const mongoURI = `mongodb+srv://${MONGODB_USER}:${encodeURIComponent(MONGODB_PASSWORD)}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;

  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Mongo connection error:', error);
    throw error;
  }
};

export default initMongoConnection;
