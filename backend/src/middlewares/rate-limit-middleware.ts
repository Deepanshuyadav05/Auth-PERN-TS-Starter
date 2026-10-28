import rateLimit from "express-rate-limit"
import ApiErrorClass from "../utils/api-error-class.js";

// builds a limiter that passes the error to our errorHandlerMiddleware instead of sending its own response
const createLimiter = (windowMs: number, limit: number, message: string, skipSuccessfulRequests = false) =>
    rateLimit({
        windowMs,
        limit,
        skipSuccessfulRequests, // only count failed attempts (useful for login)
        standardHeaders: "draft-8", // sends RateLimit headers so the client knows when to retry
        legacyHeaders: false,
        handler: (_req, _res, next) => next(ApiErrorClass.tooManyRequests(message)),
    });

// whole API: stops general flooding
export const globalLimiter = createLimiter(15 * 60 * 1000, 100, "Too many requests, please try again later");

// login: 5 failed attempts per 15 min, successful logins don't count
export const loginLimiter = createLimiter(15 * 60 * 1000, 5, "Too many login attempts, please try again after 15 minutes", true);

// signup: 5 accounts per hour per IP
export const signupLimiter = createLimiter(60 * 60 * 1000, 5, "Too many accounts created, please try again later");

// routes that send emails: 3 per 15 min
export const emailLimiter = createLimiter(15 * 60 * 1000, 3, "Too many email requests, please try again after 15 minutes");