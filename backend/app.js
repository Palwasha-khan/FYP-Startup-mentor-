import express from 'express'
const app = express();
import dotenv  from 'dotenv'
import {connectDatabase} from './config/dbConnect.js'
import errorMiddleware from "./middlewares/errors.js"
import cookieParser from "cookie-parser";
import cors from "cors";


//Handle Uncaught exceptions
process.on("uncaughtException", (err) => {
    console.log(`ERROR: ${err}`);
    console.log("Shutting down server dur to Uncaught exceptions");
    process.exit(1);   
})
dotenv.config({path: 'backend/config/config.env'})


//connecting database
connectDatabase();

app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://startup-mentor-sm.vercel.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept'
    ]
}))

// Handle preflight requests for ALL routes
app.options('*', cors())
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
 
//import all routess here
import ideaRoute from "./routes/ideas.js";
import predictionRoutes from "./routes/predictionRoutes.js";
import feedbackRoute from "./routes/feedback.js"
import userRoute from "./routes/userRoutes.js"
import contactRoute from "./routes/conatcUs.js"

app.use('/api',ideaRoute)
app.use("/api", feedbackRoute);
app.use("/api", predictionRoutes);
app.use("/api", userRoute);
app.use("/api", contactRoute);

//using error middleware
app.use(errorMiddleware)
 
const server = app.listen(process.env.PORT,() =>{
    console.log(`server started at PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode`)
})

//Handle Unhandled promise rejections
process.on("unhandledRejection", (err) => {
    console.log(`ERROR: ${err}`);
    console.log("Shutting down server dur to Unhandle promise rejction");
    server.close(() =>{
        process.exit(1);
    })
})