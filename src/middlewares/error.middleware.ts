import { Request, Response, NextFunction } from "express";
import { HttpError } from "../utils/http-error";

export const ErrorHandler = (
    error: Error | HttpError, 
    request: Request, 
    response: Response, 
    next: NextFunction
) => {
    const isHttpError = error instanceof HttpError

    // const statusCode = (error instanceof HttpError && error.statusCode) || (error as any).statusCode || 500
    // const errorCode = (error instanceof HttpError && error.errorCode) || "SERVER_ERROR"
    // const message = error.message || "Internal Server Error"

    const statusCode = (isHttpError && error.statusCode) || (error as any).statusCode || 500
    const errorCode = (isHttpError && error.errorCode) || "SERVER_ERROR"
    const message = error.message || "Internal Server Error"
    const details = (isHttpError && error.details) || undefined

    response.status(statusCode).send({
        status: "error",
        error: {
            code: errorCode,
            status: statusCode,
            message,
            details
        },
        ...(process.env.NODE_ENV !== "production" && {
            stack: error.stack
        })
    })
}