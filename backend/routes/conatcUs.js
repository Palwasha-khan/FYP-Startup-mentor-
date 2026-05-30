import express from 'express';
import { submitContact, getAllContacts } from '../controllers/contactUsController.js';

const router = express.Router();

router.post('/contact/submit', submitContact);
router.get('/contact/all', getAllContacts); 

export default router;
