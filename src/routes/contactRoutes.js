// src/routes/contactRoutes.js
import express from 'express';
const router = express.Router();
import * as contactService from '../services/contactService.js';

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

export default router;
