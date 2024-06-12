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
import { authenticate } from '../middlewares/authenticate.js'; 

const router = express.Router();
router.use(authenticate);

router.get('/', authenticate, ctrlWrapper(getAllContactsService)); 
router.get('/:contactId', authenticate, ctrlWrapper(getContactById)); 
router.post('/', 
  authenticate, 
  validateBody(createContactSchema), 
  ctrlWrapper(createContact)
);
router.put('/:contactId' ,
  authenticate, 
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactController)
); 
router.patch('/:contactId',
  authenticate, 
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController)
);
router.delete('/:contactId', authenticate, ctrlWrapper(deleteContact)); 

export default router;
