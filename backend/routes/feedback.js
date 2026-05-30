import express from 'express';
import { submitFeedback, getAllFeedback,   } from '../controllers/feedbackController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/feedback/submit',isAuthenticated, submitFeedback); 
router.get('/feedback/all', getAllFeedback); 

export default router;
