import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import Feedback from '../models/feedback.js';


// Submit feedback /api/submitfeedback
export const submitFeedback = catchAsyncErrors(async (req, res) => {
     
        const userId = req.user._id;
        const userName = req.user.name; 
        const { title, message, rating } = req.body;

        if (!title || !rating || !message) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const feedback = await Feedback.create({
            title, 
            message, 
            rating, 
            user: userId,   
            name: userName });

        res.status(201).json({ success: true, message: "Feedback submitted successfully", data: feedback });
     
}); 

// Get all feedback (for dashboard) ->/api/Feedbacks
export const getAllFeedback = async (req, res) => {
    try {
       const feedbacks = await Feedback.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
       res.status(200).json({ success: true, data: feedbacks });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
