import express from 'express'
import errorHandlerMiddleware from "./middlewares/error-handler-middleware.js";
import ApiErrorClass from "./utils/api-error-class.js";
import authRoutes from "./modules/auth/auth-routes.js";
import cookieParser from "cookie-parser";
import {globalLimiter} from "./middlewares/rate-limit-middleware.js";

const app = express()

// in production, we sit behind the host's proxy, so read the real client IP from X-Forwarded-For
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1)
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

//global rate limiter
app.use('/api', globalLimiter)
app.use('/api/auth', authRoutes)


// It does not fire when a controller throws an error. If the login controller throws ApiErrorClass.unauthorized(), Express skips all normal middleware, including the catch-all, and goes straight to errorMiddleware.
// the catch-all
app.use((req, _res, _next) => {
    throw ApiErrorClass.notFound(`Route ${req.method} ${req.originalUrl} not found`)
})

app.use(errorHandlerMiddleware)

export default app