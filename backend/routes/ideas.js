import express from "express";
import {  deleteIdea, getMyIdeas, submitIdea } from "../controllers/ideaController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("idea//all",isAuthenticated,getMyIdeas);
router.post("idea//new", isAuthenticated, submitIdea); 
router.delete("idea//delete/:id", isAuthenticated, deleteIdea);

export default router;
