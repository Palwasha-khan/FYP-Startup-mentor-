import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Idea from "../models/idea.js";
import Prediction from "../models/prediction.js";
import axios from "axios";

// create new idea => /api/new/ideas
// create new idea => /api/new/ideas
export const submitIdea = catchAsyncErrors(async (req, res, next) => {
   
// 1. Sirf un fields ki list jo required hain
const requiredFields = ['title', 'description', 'locationName', 'category'];

// 2. Safely check karein bina trim() crash ke
const missingField = requiredFields.find(field => {
  const value = req.body[field];
  return value === undefined || value === null || String(value).trim() === "";
});

// 3. Agar koi bhi aik field missing mili, to yahin se response return kar do
if (missingField) {
  return res.status(400).json({ 
    success: false, 
    message: `${missingField} is required` 
  });
}
   const userId = req.user._id;

  // Destructure after safety validation ensures base properties exist safely
  const {
    title,
    description,
    locationName,
    lat,
    lng,
    category,
    fundingAmount,
    teamSize,
    avgTeamExperience,
    mentorshipSupport,
    incubationSupport,
    marketReadinessLevel,
    marketReadinessItems
  } = req.body;

  try {
    // 2. Call FastAPI Service Layer
    const predictionResponse = await axios.post(
      process.env.AI_SERVICE_URL,
      {
        title,
        category,
        locationName,
        description,
        teamSize: Number(teamSize) || 0,
        avgTeamExperience: parseFloat(avgTeamExperience) || 0,
        fundingAmount: parseFloat(fundingAmount) || 0,
        mentorshipSupport: mentorshipSupport === 'true' || mentorshipSupport === true,
        incubationSupport: incubationSupport === 'true' || incubationSupport === true,
        marketReadinessLevel: parseInt(marketReadinessLevel) || 0
      }
    );

    const aiResult = predictionResponse.data;

    // 3. Save Idea Document to MongoDB
    const idea = await Idea.create({
      title,
      description,
      location: locationName,
      category,
      latitude: lat,
      longitude: lng,
      funding: fundingAmount || 0,
      teamSize: teamSize || 0,
      avgTeamExperience: avgTeamExperience || 0,
      mentorshipSupport,
      incubationSupport,
      marketReadinessLevel,
      marketReadinessItems,
      user: userId
    });

    // 4. Create Prediction Record with Fallback Engine Maps
    const prediction = await Prediction.create({
      idea: idea._id,
      prediction: aiResult.prediction || aiResult.decision || "Analysis Complete", 
      success_probability: aiResult.success_probability || 0,
      positiveComments: aiResult.positiveComments || 0,
      negativeComments: aiResult.negativeComments || 0,
      averageRating: aiResult.averageRating || 0,
      
      risks: Array.isArray(aiResult.risks) 
        ? aiResult.risks.join(", ") 
        : (aiResult.risks || "None identified"),
        
      suggestions: Array.isArray(aiResult.recommendations) 
        ? aiResult.recommendations.join(". ") 
        : (aiResult.suggestions || aiResult.recommendations || "No specific suggestions")
    });

    // 5. Atomic reference binding mapping
    idea.prediction = prediction._id;
    await idea.save();

    // Final response delivery status code 201
    return res.status(201).json({
      success: true,
      idea,
      prediction
    });

  } catch (error) {
    console.error("AI Service Execution Failure Log:", error);
    
    const errorMessage = error.response?.data?.detail 
      ? JSON.stringify(error.response.data.detail) 
      : error.message;

    return res.status(error.response?.status || 500).json({
      success: false,
      message: "AI Analysis failed",
      error: errorMessage
    });
  }
});

// get all ideas => /api/ideas
export const getMyIdeas = catchAsyncErrors(async (req, res) => {
  const ideas = await Idea.find({ user: req.user._id })
    .populate("prediction")
    .sort({ createdAt: -1 }); 

  res.json({
    success: true,
    count: ideas.length,
    data: ideas
  });
});

// delete idea => /api/ideas/:id
export const deleteIdea = catchAsyncErrors(async (req, res) => {
  const idea = await Idea.findById(req.params.id);

  if (!idea) {
    return res.status(404).json({ success: false, message: "Idea not found" });
  }

  if (idea.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: "Unauthorized" });
  }

  // Cleanup: Delete the associated prediction if it exists
  if (idea.prediction) {
    await Prediction.findByIdAndDelete(idea.prediction);
  }

  await Idea.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Idea and prediction deleted successfully"
  });
});
