// src/routers/contacts.js

import express from 'express';
import {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../controllers/contactController.js';
import { ctrlWrapper } from '../middlewares/ctrlWrapper.js';
const router = express.Router();
router.get('/contacts', ctrlWrapper(getContacts));
router.get('/contacts/:contactId', getContactById);
router.post('/students', ctrlWrapper(createContact));

router.patch('/contacts/:contactId',ctrlWrapper(updateContact));
router.delete('/contacts/:contactId',ctrlWrapper (deleteContact));

export default router;
