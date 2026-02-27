import express from 'express';
import { registerUser, loginUser, getUserProfile, updateUserProfile, logoutUser, forgotPassword, resetPassword, updatePassword, uploadAvatar } from '../controllers/userController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';  

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get("/logout", logoutUser);
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);

router.get('/me', isAuthenticated, getUserProfile);
router.put('/me/update', isAuthenticated, updateUserProfile);
router.put('/password/update', isAuthenticated, updatePassword);
router.put('/me/upload_avatar', isAuthenticated, uploadAvatar);


export default router;
