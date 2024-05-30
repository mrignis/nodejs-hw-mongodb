import express from 'express';
import {
  getContacts,
  getContactById,
  createContact,
  upsertContactController,
  updateContactPartial,
  deleteContact,
} from '../controllers/contactController.js';
import { ctrlWrapper } from '../middlewares/ctrlWrapper.js';

const router = express.Router();

router.get('/contacts', ctrlWrapper(getContacts));
router.get('/contacts/:contactId', ctrlWrapper(getContactById));
router.post('/contacts', ctrlWrapper(createContact));
router.put('/contacts/:contactId', ctrlWrapper(upsertContactController)); 
router.patch('/contacts/:contactId', ctrlWrapper(updateContactPartial));
router.delete('/contacts/:contactId', ctrlWrapper(deleteContact));

export default router;
