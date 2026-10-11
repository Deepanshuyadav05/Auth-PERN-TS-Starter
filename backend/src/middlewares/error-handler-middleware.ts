import type {Response, Request, NextFunction} from "express";
import ApiErrorClass from "../utils/api-error-class.js";

const errorHandlerMiddleware = (err : unknown, _req : Request, res : Response, next : NextFunction) => {
    if(err instanceof ApiErrorClass) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors,
        });
    }

    console.error(err);
    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        errors: [],
    })
}

export default errorHandlerMiddleware;