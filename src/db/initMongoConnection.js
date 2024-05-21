// src/db/initMongoConnection.js
const mongoose = require('mongoose');
const pino = require('pino')();

const initMongoConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    pino.info('Mongo connection successfully established!');
  } catch (error) {
    pino.error('Error connecting to MongoDB:', error.message);
  }
};

module.exports = { initMongoConnection };
