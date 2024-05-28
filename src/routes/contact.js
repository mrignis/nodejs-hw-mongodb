import express from 'express';
import { getContacts, getContactById, createContact, updateContact, deleteContact } from '../controllers/contactController.js';
import ctrlWrapper from '../middlewares/ctrlWrapper.js';

const router = express.Router();

router.get('/', ctrlWrapper(getContacts));
router.get('/:contactId', ctrlWrapper(getContactById));
router.post('/', ctrlWrapper(createContact));
router.patch('/:contactId', ctrlWrapper(updateContact));
router.delete('/:contactId', ctrlWrapper(deleteContact));

export default router;
