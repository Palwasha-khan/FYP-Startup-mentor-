# Startup-Mentor-fyp

🚀 Startup Mentor: AI-Driven Venture Evaluation & Risk Analysis
Startup Mentor is a sophisticated decision-support system designed for entrepreneurs. Unlike basic evaluators, this platform integrates a custom-trained machine learning model to predict success probability, leverages LLMs for regional sentiment analysis, and utilizes Location APIs to provide a localized risk assessment.

🌟 Key Features
Success Probability Prediction: A custom-trained machine learning model analyzes user submissions to calculate a statistical probability of startup success.

Geospatial Risk Profiling: Integrated Location APIs analyze regional market saturation and geographic constraints to provide localized risk data.

LLM Sentiment Analysis: Performs deep-dive sentiment analysis on existing startup data and competitor landscapes to gauge market temperature.

Aesthetic Founder Dashboard: A high-fidelity, "cute & aesthetic" UI/UX (Pink & Purple theme) designed for an intuitive user experience.

PDF Reporting: Generates comprehensive, professional PDF reports featuring evaluation metrics, risk , and personalized AI recommendations.

Secure Profile Management: Full authentication system with Cloudinary-integrated profile picture uploads and secure password management.

🛠️ Tech Stack
Frontend:

Framework: React.js (Vite)

State Management: Redux Toolkit & RTK Query

Styling: Tailwind CSS, Shadcn UI, Lucide React Icons

PDF Logic: jsPDF / React-PDF

Backend:

Runtime: Node.js & Express.js

Database: MongoDB Atlas

File Hosting: Cloudinary (Profile Avatars)

Email: Resend / Nodemailer

AI & Data Science:

ML Model: Xgboost classification Model

NLP: LLM Integration for Sentiment Analysis

APIs: Google Maps/Location API for geospatial risk assessment

⚙️ Installation & Setup
Prerequisites
Node.js (v18+)

MongoDB Atlas Account

Cloudinary API Keys

1. Clone the repository
```bash
git clone https://github.com/Palwasha-Khan/startup-mentor.git
cd startup-mentor
```
2. Install Backend Dependencies
```bash 
npm install
```
3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```
4. Environment Variables
Create a .env file in the root of your backend folder and add the following:

Code snippet
```bash
PORT=4000
NODE_ENV=DEVELOPMENT
FRONTEND_URL=http://localhost:5173

DB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key
COOKIE_EXPIRES_TIME=7

CLOUDINARY_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

RESEND_API_KEY=your_resend_key

SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_EMAIL=your_email
SMTP_PASSWORD=your_password
SMTP_FROM_EMAIL=your_email
SMTP_FROM_NAME=your_name
```
5. Run the App
Terminal 1 (Backend):

```bash
cd backend
npm run dev 
```
Terminal 2 (Frontend):

```bash
cd frontend
npm run dev
```
📊 System Architecture
Input: User submits startup details and target location via the React dashboard.

Processing: * The Location API fetches regional market data.

The Trained Model runs a regression/classification to find success probability.

The LLM analyzes sentiment from existing market data.

Output: Results are aggregated on the frontend and made available as a downloadable PDF report.

📂 Project Structure
Plaintext
startup-mentor/
├── backend/
│   ├── controllers/      # Logic for Users, Ideas, and Analysis
│   ├── models/           # Mongoose Schemas (User, Contact, Idea,Prediction,feedback)
│   ├── utils/            # Cloudinary & Email configurations
│   └── app.js            # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI (Shadcn)
│   │   ├── redux/        # RTK Query API slices
│   │   └── pages/        # Dashboard, Profile, Landing
└── ml_model/             # Python scripts and trained datasets
👩‍💻 The Team
Palwasha Khan - Lead Full Stack Developer & ML Integration

Sana - Team Member

Ammara - Team Member

Sumbal - Team Member

📜 License
This project is licensed under the MIT License - see the LICENSE file for details.

💡 Project Status: Final Year Project (FYP)
University of Mianwali - Department of Software Engineering
