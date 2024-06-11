import express from 'express';
import {
  getAllContactsService,
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

router.get('/', ctrlWrapper(getAllContactsService));
router.get('/:contactId', ctrlWrapper(getContactById));
router.post('/', 
  validateBody(createContactSchema), 
ctrlWrapper(createContact));
router.put('/:contactId' ,
  validateBody(updateContactSchema),
 ctrlWrapper(updateContactController)); 
router.patch('/:contactId',
  validateBody(updateContactSchema),
 ctrlWrapper(patchContactController));
router.delete('/:contactId', ctrlWrapper(deleteContact));

export default router;
