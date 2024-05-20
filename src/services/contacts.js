const Contact = require('../db/Contact');

async function getAllContacts() {
  return await Contact.find({});
}

async function getContactById(contactId) {
  return await Contact.findById(contactId);
}

module.exports = { getAllContacts, getContactById };
