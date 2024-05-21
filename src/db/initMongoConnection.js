// src/db/initMongoConnection.js
import { connect } from 'mongoose';
const pino = require('pino')();

const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } = process.env;
const uri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;

async function initMongoConnection() {
  try {
    await connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    pino.info('Mongo connection successfully established!');
  } catch (error) {
    pino.error(`MongoDB connection error: ${error}`);
  }
}

export default initMongoConnection;
