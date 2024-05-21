// src/services/contactService.js
const Contact = require('../db/contactModel');

const getAllContacts = async () => {
  const contacts = await Contact.find();
  return contacts;
};

const getContactById = async (contactId) => {
  const contact = await Contact.findById(contactId);
  return contact;
};

module.exports = {
  getAllContacts,
  getContactById,
};
