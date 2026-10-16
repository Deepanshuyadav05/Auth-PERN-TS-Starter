import {Router} from "express";
import zodValidationMiddleware from "../../middlewares/zod-validation-middleware.js";
import {signupSchema} from "./auth-validations.js";
import * as auth_controller from "./auth-controllers.js";

const route = Router()

route.post('/signup', zodValidationMiddleware(signupSchema) ,auth_controller.signupController);

export default route;