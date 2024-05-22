// src/controllers/contacts.js

import {  getContact } from '../services/contacts.js';

export const getContactById = async (req, res) => {
  const contactId = req.params.contactId;
  try {
    const contact = await getContact(contactId);
    if (!contact) {
      res.status(404).json({
        status: 'error',
        message: `Contact with id ${contactId} not found`,
      });
      return;
    }
    res.status(200).json({
      status: 'success',
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    console.error(`Error while getting contact with id ${contactId}`, error);
    res.status(500).json({
      status: 'error',
      message: `Failed to retrieve contact with id ${contactId}`,
      error: error.message,
    });
  }
};
