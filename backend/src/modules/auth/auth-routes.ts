import {Router} from "express";
import zodValidationMiddleware from "../../middlewares/zod-validation-middleware.js";
import {loginSchema, signupSchema, tokenSchema} from "./auth-validations.js";
import * as auth_controller from "./auth-controllers.js";

const route = Router()

route.post('/signup', zodValidationMiddleware(signupSchema) ,auth_controller.signupController);
route.post('/verify-email', zodValidationMiddleware(tokenSchema), auth_controller.emailVerifyController);
route.post('/login', zodValidationMiddleware(loginSchema) ,auth_controller.loginController);

export default route;