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
  category: {
    type: String,
    required: true,
    enum: ['Technology', 'Health', 'Education', 'Finance','Food', 'Other']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required:true,
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
