import ErrorHandler from "../utils/errorHandler.js";

const errorMiddleware = (err, req, res, next) => {
    // Set default status code
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // For development, you can log the full error
    console.error(err);

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
        stack: process.env.NODE_ENV === "DEVELOPMENT" ? err.stack : undefined
    });
};

export default errorMiddleware;
