// src/routes/contact.js
import express from 'express';
import Contact from '../db/contactModel.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json({ status: 'success', message: 'Successfully found contacts!', data: contacts });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.get('/:contactId', async (req, res) => {
  const { contactId } = req.params;
  try {
    const contact = await Contact.findById(contactId);
    if (!contact) {
      res.status(404).json({ status: 'error', message: `Contact with id ${contactId} not found` });
      return;
    }
    res.json({ status: 'success', message: `Successfully found contact with id ${contactId}!`, data: contact });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;
