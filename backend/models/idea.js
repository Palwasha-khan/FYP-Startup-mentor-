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
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Technology', 'Health', 'education', 'Finance','Food', 'Other']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required:true,
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
  prediction: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Prediction"
}

}, { timestamps: true });

export default mongoose.model('Idea', ideaSchema);
