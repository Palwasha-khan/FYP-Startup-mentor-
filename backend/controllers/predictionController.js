import Prediction from "../models/prediction.js";

export const getPredictionByIdea = async (req, res, next) => {
  // Find prediction by Idea ID and 'populate' the linked 'idea' field
  const prediction = await Prediction.findOne({ idea: req.params.ideaId }).populate("idea");

  if (!prediction) {
    return res.status(404).json({ success: false, message: "Prediction not found" });
  }

  res.status(200).json({
    success: true,
    data: prediction // This will now contain the full idea object inside it
  });
};

export const getAllPredictions = async (req, res) => {
  const predictions = await Prediction.find().populate("idea");
  res.json(predictions);
};
