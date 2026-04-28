import mongoose  from 'mongoose';
const ideaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  funding: {
    type: Number, // Changed to Number as it's better for calculations
    required: true
  },
  category: {
    type: String,
    required: true,
    // UPDATED: Matches your frontend categories exactly
    enum: ['Technology', 'Healthcare', 'Finance', 'Education', 'E-Commerce', 'Food']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  latitude: {
    type: String,
    required: true
  },
  longitude: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  // --- NEW FIELDS ADDED BELOW ---
  teamSize: {
    type: Number,
    default: 1
  },
  avgTeamExperience: {
    type: Number,
    default: 0
  },
  mentorshipSupport: {
    type: Number, // 0 or 1
    enum: [0, 1],
    default: 0
  },
  incubationSupport: {
    type: Number, // 0 or 1
    enum: [0, 1],
    default: 0
  },
 marketReadinessLevel: { type: Number, default: 0 },
  marketReadinessItems: [{ type: String }], // Array of strings for the checkboxes
  // --- END NEW FIELDS ---
  prediction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Prediction"
  }
}, { timestamps: true });

export default mongoose.model('Idea', ideaSchema);