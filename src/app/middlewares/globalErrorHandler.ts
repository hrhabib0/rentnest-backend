import { ErrorRequestHandler } from "express";
import AppError from "../errors/AppError";

const globalErrorHandler: ErrorRequestHandler = (
    error,
    req,
    res,
    next
) => {
    let statusCode = 500;
    let message = "Something went wrong";
    let errorDetails: unknown = null;

    if (error instanceof AppError) {
        statusCode = error.statusCode;
        message = error.message;
    } else if (error instanceof Error) {
        message = error.message;
    }

    if (process.env.NODE_ENV === "development") {
        errorDetails = error;
    }

    res.status(statusCode).json({
        success: false,
        message,
        errorDetails,
    });
};

export default globalErrorHandler;