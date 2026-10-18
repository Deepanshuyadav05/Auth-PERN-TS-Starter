import * as auth_Service from "./auth-services.js"
import type {Request, Response} from "express";
import ApiResponseClass from "../../utils/api-response-class.js";
import {setRefreshTokenCookie} from "./auth-utils/auth-cookie-config.js";

export const signupController = async (req: Request, res: Response) => {
    const response = await auth_Service.SignupService(req.body)
    return ApiResponseClass.created(res, "User created successfully", response)
}

//email verification controller
export const emailVerifyController = async (req: Request, res: Response) => {

    const response = await auth_Service.EmailVerificationService(req.body.token)
    return ApiResponseClass.ok(res, "Email verified successfully", response)
}

//login controller
export const loginController = async (req: Request, res: Response) => {
    const {refreshToken, ...data} = await auth_Service.loginService(req.body)
    //setting refresh token in cookie
    setRefreshTokenCookie(res, refreshToken)

    return ApiResponseClass.ok(res, "User login successfully", data)
}