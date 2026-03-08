import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Idea from "../models/idea.js"
import Prediction from "../models/Prediction.js";
import ErrorHandler from "../utils/errorHandler.js";
import callPythonAI from "../services/aiService.js";
import axios from "axios";

//create new idea  => /api/new/ideas
export const submitIdea = catchAsyncErrors(async (req, res) => {

  const userId = req.user._id;
  const {  title ,description, location, category ,funding} = req.body;
   

  if (!title || !description || !location || !category || !funding) {
              return res.status(400).json({ success: false, message: "All fields are required" });
          }
 

   // Call FastAPI
    const predictionResponse = await axios.post(
      "http://127.0.0.1:8080/predict",
      {
        name: title,
        description,
        location,
        category,
        funding
      }
    );

  const aiResult = predictionResponse.data;

  // Create idea
  const idea = await Idea.create({
    title,
    description,
    location,
    category,
    funding,
    user: userId
  });

  // Create prediction
  const prediction = await Prediction.create({
    idea: idea._id,
    prediction: aiResult.prediction,
    innovationScore: aiResult.innovationScore,
    marketFit: aiResult.marketFit,
    viabilityScore: aiResult.viabilityScore,
    risk: aiResult.risk,
    recommendation: aiResult.recommendation
  });

   idea.prediction = prediction._id;
   await idea.save();
   
  res.status(201).json({
    success: true,
    idea,
    prediction
  });
});

//get all ideas => /api/ideas
export const getMyIdeas = async (req, res) => {
  const ideas = await Idea.find({ user: req.user._id })
    .populate("prediction")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: ideas
  });
};