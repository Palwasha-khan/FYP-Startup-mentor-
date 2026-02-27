import Prediction from "../models/Prediction.js";

export const getPredictionByIdea = async (req, res) => {
  const prediction = await Prediction.findOne({ idea: req.params.ideaId });

  res.json(prediction);
};

export const getAllPredictions = async (req, res) => {
  const predictions = await Prediction.find().populate("idea");
  res.json(predictions);
};
