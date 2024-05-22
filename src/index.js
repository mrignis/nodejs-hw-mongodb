import { initMongoConnection } from './db/initMongoConnection.js';
import setupServer from './server.js';
import { connectDB } from './db/db.js';
import Contact from './db/contactModel.js';
import fs from 'fs';

// Connect to MongoDB
const bootstrap = async () => {
  try {
    await initMongoConnection();
    connectDB();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

bootstrap();

// Load contacts from contacts.json
const contacts = JSON.parse(fs.readFileSync('./contacts.json', 'utf-8'));

// Import contacts to MongoDB
const importData = async () => {
  try {
    await Contact.create(contacts);
    console.log('Data Imported...');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Import data
if (process.argv[2] === '-i') {
  importData();
} else {
  // Start the server
  setupServer();
}
