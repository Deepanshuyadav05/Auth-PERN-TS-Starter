import {Router} from "express";
import zodValidationMiddleware from "../../middlewares/zod-validation-middleware.js";
import {forgotPasswordSchema, loginSchema, resetPasswordSchema, signupSchema, tokenSchema} from "./auth-validations.js";
import * as auth_controller from "./auth-controllers.js";
import {requireAuth} from "./auth-middlewares.js";
import {emailLimiter, loginLimiter, signupLimiter} from "../../middlewares/rate-limit-middleware.js";

const route = Router()

route.post('/signup',signupLimiter ,zodValidationMiddleware(signupSchema) ,auth_controller.signupController);
route.post('/verify-email' ,zodValidationMiddleware(tokenSchema), auth_controller.emailVerifyController);
route.post('/login', loginLimiter,zodValidationMiddleware(loginSchema) ,auth_controller.loginController);
route.post('/refresh', auth_controller.refreshTokenController);
route.get('/me', requireAuth, auth_controller.getMeController);
route.post('/logout', auth_controller.logoutController);
route.post('/forgot-password',emailLimiter ,zodValidationMiddleware(forgotPasswordSchema) ,auth_controller.forgotPasswordController);
route.post('/reset-password', zodValidationMiddleware(resetPasswordSchema), auth_controller.resetPasswordController);
route.post('/resend-verification',emailLimiter ,zodValidationMiddleware(forgotPasswordSchema), auth_controller.resendVerificationController)

export default route;