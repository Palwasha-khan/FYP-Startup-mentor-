import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Idea from "../models/idea.js"
import Prediction from "../models/Prediction.js";
import ErrorHandler from "../utils/errorHandler.js";
import callPythonAI from "../services/aiService.js";
import axios from "axios";

// create new idea => /api/new/ideas
export const submitIdea = catchAsyncErrors(async (req, res) => {
  const userId = req.user._id;

  // 1. Destructure ALL new fields from the request body
  const {
    title,
    description,
    locationName, // renamed from location to match frontend
    lat,
    lng,
    category,
    fundingAmount, // renamed from funding
    teamSize,
    avgTeamExperience,
    mentorshipSupport,
    incubationSupport,
    marketReadinessLevel,
  } = req.body;

  // 2. Updated Validation
  if (!title || !description || !locationName || !category) {
    return res.status(400).json({ success: false, message: "Required fields are missing" });
  }

  // // 3. Call FastAPI with the expanded data set
  // const predictionResponse = await axios.post(
  //   "http://127.0.0.1:8080/predict",
  //   {
  //     name: title,
  //     description,
  //     location: locationName,
  //     category,
  //     funding: parseFloat(fundingAmount) || 0,
  //     latitude: parseFloat(lat),
  //     longitude: parseFloat(lng),
  //     // NEW AI INPUTS
  //     team_size: Number(teamSize),
  //     experience: Number(avgTeamExperience),
  //     mentorship: mentorshipSupport,
  //     incubation: incubationSupport,
  //     readiness: marketReadinessLevel
  //   }
  // );

  // const aiResult = predictionResponse.data;

  const aiResult = {
    prediction: "High Potential (Mock)",
    innovationScore: 85,
    marketFit: 70,
    viabilityScore: 75,
    positiveComments: 20, 
    negativeComments: 14,
    averageRating: 4.2,
    risks: "Testing phase risks",
    recommendations: "Continue with the prototype."
  };

  // 4. Save Idea with NEW fields
  const idea = await Idea.create({
    title,
    description,
    location: locationName,
    category,
    latitude: lat,
    longitude: lng,
    funding: fundingAmount,
    teamSize,
    avgTeamExperience,
    mentorshipSupport,
    incubationSupport,
    marketReadinessLevel,
    user: userId
  });

  // 5. Create prediction (Keep this as is, assuming AI result structure remains same)
  const prediction = await Prediction.create({
    idea: idea._id,
    prediction: aiResult.prediction,
    innovationScore: aiResult.innovationScore,
    marketFit: aiResult.marketFit,
    viabilityScore: aiResult.viabilityScore,
    positiveComments: aiResult.positiveComments,
    negativeComments: aiResult.negativeComments,
    averageRating: aiResult.averageRating,
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