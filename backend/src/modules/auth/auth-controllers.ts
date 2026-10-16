import * as auth_Service from "./auth-services.js"
import type {Request, Response} from "express";
import ApiResponseClass from "../../utils/api-response-class.js";

export const signupController = async (req: Request, res: Response) => {
    const response = await auth_Service.SignupService(req.body)
    return ApiResponseClass.created(res, "User created successfully", response)
}