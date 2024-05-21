// src/services/contactService.js
const Contact = require('../db/models/contact');

async function getAllContacts() {
  try {
    const contacts = await Contact.find();
    return { status: 'success', message: 'Successfully found contacts!', data: contacts };
  } catch (error) {
    return { status: 'error', message: 'Failed to fetch contacts', error: error.message };
  }
}

module.exports = { getAllContacts };
