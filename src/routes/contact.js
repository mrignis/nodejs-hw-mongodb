import express from 'express';
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContactController,
  patchContactController,
  deleteContact,
} from '../controllers/contactController.js';
import { ctrlWrapper } from '../middlewares/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createContactSchema, updateContactSchema } from '../validation/contacts.js';

const router = express.Router();

router.get('/contacts', ctrlWrapper(getAllContacts));
router.get('/contacts/:contactId', ctrlWrapper(getContactById));
router.post('/contacts', validateBody(createContactSchema), ctrlWrapper(createContact));
router.put('/contacts/:contactId' ,validateBody(updateContactSchema), ctrlWrapper(updateContactController)); 
router.patch('/contacts/:contactId',validateBody(updateContactSchema), ctrlWrapper(patchContactController));
router.delete('/contacts/:contactId', ctrlWrapper(deleteContact));

export default router;
