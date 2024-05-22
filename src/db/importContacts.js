import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Contact from './contactModel.js';
import connectDB from './initMongoConnection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const importContacts = async () => {
  await connectDB();

  const contactsFilePath = path.join(__dirname, 'contacts.json');
  const contactsData = JSON.parse(fs.readFileSync(contactsFilePath, 'utf-8'));

  try {
    await Contact.insertMany(contactsData);
    console.log('Contacts imported successfully');
  } catch (error) {
    console.error('Error importing contacts:', error);
  } finally {
    mongoose.connection.close();
  }
};

importContacts();
