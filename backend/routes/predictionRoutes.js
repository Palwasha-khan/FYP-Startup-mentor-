import express from "express";
import {
  getPredictionByIdea,
  getAllPredictions
} from "../controllers/predictionController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/ideas/:ideaId/prediction",isAuthenticated, getPredictionByIdea);
router.get("/predictions", isAuthenticated ,getAllPredictions);

export default router;
