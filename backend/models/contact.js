import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required for contact']
    },
    email: {
        type: String,
        required: [true, 'Email is required for contact'],
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    subject: {
        type: String,
        required: [true, 'Subject is required']
    },
    message: {
        type: String,
        required: [true, 'Message is required']
    },
    user: {
        // Optional: if the contact is from a registered user, store their ID
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }
}, { timestamps: true });

export default mongoose.model('Contact', contactSchema);
