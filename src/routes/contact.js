import { Router } from 'express';
import { getAllContactsService, getContactByIdService} from '../controllers/contactController.js';

const router = Router();

router.get('/', getAllContactsService);
router.get('/:contactId', getContactByIdService);

export default router;
