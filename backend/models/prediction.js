import mongoose  from 'mongoose';

const predictionSchema = new mongoose.Schema({
  idea: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Idea",
  unique: true
  },
  prediction: { type: String, required: true },
  viabilityScore: {
    type: Number,
    required: true
  },

  marketFit: {
    type: Number,
    required: true
  },

  innovationScore: {
    type: Number,
    required: true
  },
  positiveComments: {
    type: Number,
    required: true
  },
  negativeComments: {
    type: Number,
    required: true
  },
  averageRating: {
    type: Number,
    required: true
  },

  risks: [{
    type: String
  }],

  suggestions: [{
    type: String
  }]

}, { timestamps: true });

export default mongoose.model("Prediction", predictionSchema);
