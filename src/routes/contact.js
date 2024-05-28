import express from 'express';
import { getContacts, getContactById } from '../controllers/contactController.js';
import ctrlWrapper from '../middlewares/ctrlWrapper.js';

const router = express.Router();

router.get('/', ctrlWrapper(getContacts));
router.get('/:contactId', ctrlWrapper(getContactById));

export default router;
