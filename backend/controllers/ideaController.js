import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Idea from "../models/idea.js";
import Prediction from "../models/Prediction.js";
import axios from "axios";

// create new idea => /api/new/ideas
export const submitIdea = catchAsyncErrors(async (req, res) => {
  const userId = req.user._id;

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

  // 1. Validation
  if (!title || !description || !locationName || !category) {
    return res.status(400).json({ success: false, message: "Required fields are missing" });
  }

  try {
    // 2. Call FastAPI
    const predictionResponse = await axios.post(
      "http://127.0.0.1:8080/predict",
      {
        title,
        category,
        locationName,
        description,
        teamSize: Number(teamSize),
        avgTeamExperience: parseFloat(avgTeamExperience),
        fundingAmount: parseFloat(fundingAmount) || 0,
        mentorshipSupport: Boolean(mentorshipSupport),
        incubationSupport: Boolean(incubationSupport),
        marketReadinessLevel: parseInt(marketReadinessLevel)
      }
    );

    const aiResult = predictionResponse.data;
    console.log("AI Result received:", aiResult); // Helpful for debugging

    // 3. Save Idea to MongoDB
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
      marketReadinessItems,
      user: userId
    });

    // 4. Create prediction with Fallback Mapping
    // This solves the "prediction: Path prediction is required" error
    const prediction = await Prediction.create({
      idea: idea._id,
      
      // We check for 'prediction' OR 'decision' (common in Python ML results)
      prediction: aiResult.prediction || aiResult.decision || "Analysis Complete", 
      
     success_probability: aiResult.success_probability || 0,
      positiveComments: aiResult.positiveComments || 0,
      negativeComments: aiResult.negativeComments || 0,
      averageRating: aiResult.averageRating || 0,
      
      // Ensure risks and suggestions are strings, even if AI returns arrays
      risks: Array.isArray(aiResult.risks) 
        ? aiResult.risks.join(", ") 
        : (aiResult.risks || "None identified"),
        
      suggestions: Array.isArray(aiResult.recommendations) 
        ? aiResult.recommendations.join(". ") 
        : (aiResult.suggestions || aiResult.recommendations || "No specific suggestions")
    });

    // 5. Link prediction back to idea
    idea.prediction = prediction._id;
    await idea.save();

    res.status(201).json({
      success: true,
      idea,
      prediction
    });

  } catch (error) {
    console.error("AI Service Error:", error.response?.data || error.message);
    
    // If Python returns a 422, we pass that detail back to help debugging
    const errorMessage = error.response?.data?.detail 
      ? JSON.stringify(error.response.data.detail) 
      : error.message;

    res.status(error.response?.status || 500).json({
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
    console.log(ideas)

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




// import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
// import Idea from "../models/idea.js"
// import Prediction from "../models/Prediction.js";
// import ErrorHandler from "../utils/errorHandler.js";
// import callPythonAI from "../services/aiService.js";
// import axios from "axios";

// // create new idea => /api/new/ideas
// export const submitIdea = catchAsyncErrors(async (req, res) => {
//   const userId = req.user._id;

//   // 1. Destructure ALL new fields from the request body
//   const {
//     title,
//     description,
//     locationName, // renamed from location to match frontend
//     lat,
//     lng,
//     category,
//     fundingAmount, // renamed from funding
//     teamSize,
//     avgTeamExperience,
//     mentorshipSupport,
//     incubationSupport,
//     marketReadinessLevel,
//     marketReadinessItems
//   } = req.body;

//   // 2. Updated Validation
//   if (!title || !description || !locationName || !category) {
//     return res.status(400).json({ success: false, message: "Required fields are missing" });
//   }

//   // 3. Call FastAPI with the expanded data set
//   const predictionResponse = await axios.post(
//     "http://127.0.0.1:8080/predict",
//     {
//       name: title,
//       description,
//       location: locationName,
//       category,
//       funding: parseFloat(fundingAmount) || 0,
//       latitude: parseFloat(lat),
//       longitude: parseFloat(lng),
//       // NEW AI INPUTS
//       team_size: Number(teamSize),
//       experience: Number(avgTeamExperience),
//       mentorship: mentorshipSupport,
//       incubation: incubationSupport,
//       readiness: marketReadinessLevel
//     }
//   );

//   const aiResult = predictionResponse.data;

//   // const aiResult = {
//   //   prediction: "High Potential (Mock)",
//   //   innovationScore: 85,
//   //   marketFit: 70,
//   //   viabilityScore: 75,
//   //   positiveComments: 20,
//   //   negativeComments: 14,
//   //   averageRating: 4.2,
//   //   risks: "Testing phase risks",
//   //   recommendations: "Continue with the prototype."
//   // };

//   // 4. Save Idea with NEW fields
//   const idea = await Idea.create({
  
//     title,
//     description,
//     location: locationName,
//     category,
//     latitude: lat,
//     longitude: lng,
//     funding: fundingAmount,
//     teamSize,
//     avgTeamExperience,
//     mentorshipSupport,
//     incubationSupport,
//     marketReadinessLevel,
//     marketReadinessItems,
//     user: userId
//   });

//   // 5. Create prediction (Keep this as is, assuming AI result structure remains same)
//   const prediction = await Prediction.create({
//     idea: idea._id,
//     prediction: aiResult.prediction,
//     innovationScore: aiResult.innovationScore,
//     marketFit: aiResult.marketFit,
//     viabilityScore: aiResult.viabilityScore,
//     positiveComments: aiResult.positiveComments,
//     negativeComments: aiResult.negativeComments,
//     averageRating: aiResult.averageRating,
//     risks: aiResult.risks,
//     suggestions: aiResult.recommendations
//   });

//   idea.prediction = prediction._id;
//   await idea.save();

//   res.status(201).json({
//     success: true,
//     idea,
//     prediction
//   });
// });

// //get all ideas => /api/ideas
// export const getMyIdeas = async (req, res) => {
//   const ideas = await Idea.find({ user: req.user._id })
//     .populate("prediction")
//     .sort({ createdAt: -1 });

//   res.json({
//     success: true,
//     data: ideas
//   });
// };

// // delete idea => /api/ideas/:id
// export const deleteIdea = catchAsyncErrors(async (req, res) => {

//   const idea = await Idea.findById(req.params.id);

//   if (!idea) {
//     return res.status(404).json({
//       success: false,
//       message: "Idea not found"
//     });
//   }

//   // Check if idea belongs to logged in user
//   if (idea.user.toString() !== req.user._id.toString()) {
//     return res.status(403).json({
//       success: false,
//       message: "You are not authorized to delete this idea"
//     });
//   }

//   // Delete prediction if exists
//   if (idea.prediction) {
//     await Prediction.findByIdAndDelete(idea.prediction);
//   }

//   // Delete idea
//   await Idea.findByIdAndDelete(req.params.id);

//   res.status(200).json({
//     success: true,
//     message: "Idea and prediction deleted successfully"
//   });

// });