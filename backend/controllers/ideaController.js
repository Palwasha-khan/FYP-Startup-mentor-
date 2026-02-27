import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Idea from "../models/idea.js"
import Prediction from "../models/Prediction.js";
import ErrorHandler from "../utils/errorHandler.js";
import callPythonAI from "../services/aiService.js";


//create new idea  => /api/new/ideas
export const submitIdea = catchAsyncErrors(async (req, res) => {

  const userId = req.user._id;
  const {  title ,description, location, category } = req.body;
   

  if (!title || !description || !location || !category) {
              return res.status(400).json({ success: false, message: "All fields are required" });
          }

  const idea = await Idea.create({ 
              title,
              location, 
              category, 
              user: userId,   
              description });

  // const aiResult = await callPythonAI(idea);

   const aiResult = {
        innovationScore: Math.floor(Math.random() * 100),
        marketFit: Math.floor(Math.random() * 100),
        viabilityScore: Math.floor(Math.random() * 100),
        result: "High Potential"  // optional
    };

  const prediction = await Prediction.create({
    idea: idea._id,
    ...aiResult
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