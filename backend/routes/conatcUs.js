import express from 'express';
import { submitContact, getAllContacts } from '../controllers/contactUsController.js';

const router = express.Router();

router.post('/submit', submitContact);
router.get('/all', getAllContacts); 

export default router;
