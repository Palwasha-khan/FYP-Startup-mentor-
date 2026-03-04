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
        result: "High Potential" ,
         };

         let suggestions = [];
        let risks = [];

        // 🔴 LOW VIABILITY
        if (aiResult.viabilityScore < 40) {
          suggestions.push("Re-evaluate your business model structure");
          suggestions.push("Consider reducing operational costs");
          risks.push("Low financial sustainability");
          risks.push("High chance of early-stage failure");
        }

        // 🟡 MEDIUM VIABILITY
        if (aiResult.viabilityScore >= 40 && aiResult.viabilityScore < 70) {
          suggestions.push("Optimize revenue streams before scaling");
          risks.push("Moderate financial risk during expansion");
        }

        // 🟢 HIGH VIABILITY
        if (aiResult.viabilityScore >= 70) {
          suggestions.push("Prepare for scaling and investor pitching");
        }


        // 🔴 LOW MARKET FIT
        if (aiResult.marketFit < 40) {
          suggestions.push("Conduct deeper customer validation surveys");
          suggestions.push("Refine your target audience");
          risks.push("Weak product-market alignment");
        }

        // 🟡 MEDIUM MARKET FIT
        if (aiResult.marketFit >= 40 && aiResult.marketFit < 70) {
          suggestions.push("Improve branding and positioning strategy");
          risks.push("Competitive pressure in market segment");
        }

        // 🟢 HIGH MARKET FIT
        if (aiResult.marketFit >= 70) {
          suggestions.push("Leverage early adopters for organic growth");
        }


        // 🔴 LOW INNOVATION
        if (aiResult.innovationScore < 40) {
          suggestions.push("Differentiate your idea from competitors");
          risks.push("Idea may lack uniqueness in saturated market");
        }

        // 🟡 MEDIUM INNOVATION
        if (aiResult.innovationScore >= 40 && aiResult.innovationScore < 70) {
          suggestions.push("Add unique features to increase value proposition");
        }

        // 🟢 HIGH INNOVATION
        if (aiResult.innovationScore >= 70) {
          suggestions.push("Protect your idea with intellectual property (IP)");
          suggestions.push("Highlight innovation in marketing campaigns");
        }


        // ⭐ Overall Risk Warning
        if (
          aiResult.viabilityScore < 40 &&
          aiResult.marketFit < 40
        ) {
          risks.push("High overall startup failure probability");
        }


        // 🧠 If no suggestions generated
        if (suggestions.length === 0) {
          suggestions.push("Your idea shows balanced performance. Focus on strong execution.");
        }

  const prediction = await Prediction.create({
    idea: idea._id,
    ...aiResult,
    suggestions,
    risks,
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