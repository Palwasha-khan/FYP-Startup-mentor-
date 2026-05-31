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
app.use("/api/v1", userRoute);
app.use("/api/v1", contactRoute);

//using error middleware
app.use(errorMiddleware)
 
// Only start the server if we are NOT on Vercel
if (process.env.NODE_ENV !== 'PRODUCTION') {
  const server = app.listen(process.env.PORT || 3000, () => {
    console.log(`Server started on port: ${process.env.PORT || 3000}  in ${process.env.NODE_ENV} mode`);
  });
  server.timeout = 600000;
}

//Handle Unhandled promise rejections
process.on("unhandledRejection", (err) => {
    console.log(`ERROR: ${err}`);
    console.log("Shutting down server dur to Unhandle promise rejction");
    server.close(() =>{
        process.exit(1);
    })
})

export default app;