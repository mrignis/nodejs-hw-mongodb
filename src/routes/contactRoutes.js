// src/routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const contactService = require('../services/contactService');

// GET /contacts
router.get('/contacts', async (req, res) => {
  try {
    const contacts = await contactService.getAllContacts();
    res.status(200).json({
      status: 'success',
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// GET /contacts/:contactId
router.get('/contacts/:contactId', async (req, res) => {
  const contactId = req.params.contactId;
  try {
    const contact = await contactService.getContactById(contactId);
    if (!contact) {
      res.status(404).json({ status: 'error', message: 'Contact not found' });
      return;
    }
    res.status(200).json({
      status: 'success',
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router;
