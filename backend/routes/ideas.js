import express from "express";
import {  deleteIdea, getMyIdeas, submitIdea } from "../controllers/ideaController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/all",isAuthenticated,getMyIdeas);
router.post("/new", isAuthenticated, submitIdea); 
router.delete("/delete/:id", isAuthenticated, deleteIdea);

export default router;
