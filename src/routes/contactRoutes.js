// src/routes/contactRoutes.js
import express from 'express';
import { getAllContacts } from '../controllers/contactController.js';

const router = express.Router();

router.get('/contacts', getAllContacts);

export default router;
