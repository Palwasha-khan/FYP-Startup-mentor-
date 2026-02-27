import express from 'express';
import { submitFeedback, getAllFeedback,   } from '../controllers/feedbackController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/submit',isAuthenticated, submitFeedback); 
router.get('/all', getAllFeedback); 

export default router;
