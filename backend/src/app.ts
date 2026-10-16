import express from 'express'
import errorHandlerMiddleware from "./middlewares/error-handler-middleware.js";
import ApiErrorClass from "./utils/api-error-class.js";
import authRoutes from "./modules/auth/auth-routes.js";

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes)


// It does not fire when a controller throws an error. If the login controller throws ApiErrorClass.unauthorized(), Express skips all normal middleware, including the catch-all, and goes straight to errorMiddleware.
// the catch-all
app.use((req, _res, _next) => {
    throw ApiErrorClass.notFound(`Route ${req.method} ${req.originalUrl} not found`)
})

app.use(errorHandlerMiddleware)

export default app