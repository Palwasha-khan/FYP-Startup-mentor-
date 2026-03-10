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
    risks: aiResult.risks,
    suggestions: aiResult.recommendations
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

// delete idea => /api/ideas/:id
export const deleteIdea = catchAsyncErrors(async (req, res) => {

  const idea = await Idea.findById(req.params.id);

  if (!idea) {
    return res.status(404).json({
      success: false,
      message: "Idea not found"
    });
  }

  // Check if idea belongs to logged in user
  if (idea.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to delete this idea"
    });
  }

  // Delete prediction if exists
  if (idea.prediction) {
    await Prediction.findByIdAndDelete(idea.prediction);
  }

  // Delete idea
  await Idea.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Idea and prediction deleted successfully"
  });

});