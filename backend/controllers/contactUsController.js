import Contact from '../models/contact.js';

import { Resend } from 'resend';

// Initialize Resend with your API Key (Put this in your .env file!)
const resend = new Resend(process.env.RESEND_API_KEY);

export const submitContact = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // 1. Save to Database (You already have this)
        const contact = await Contact.create({ name, email, subject, message });

        // 2. Send Email to Yourself
        await resend.emails.send({
            from: 'FYP Contact <onboarding@resend.dev>',
            to: ['palwashakhan.2201@gmail.com'], // The email where YOU want to receive alerts
            subject: `New Inquiry: ${subject}`,
            html: `
                <div style="font-family: sans-serif; line-height: 1.5; color: #333;">
                    <h2>New Message from ${name}</h2>
                    <p><strong>From:</strong> ${email}</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <hr />
                    <p><strong>Message:</strong></p>
                    <p style="background: #f4f4f4; padding: 15px; border-radius: 5px;">${message}</p>
                </div>
            `,
        });

        res.status(201).json({ 
            success: true, 
            message: "Message sent and saved successfully", 
            data: contact 
        });

    } catch (err) {
        console.error("Contact Form Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Get all contact messages 
export const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: contacts });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
