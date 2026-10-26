import * as auth_Service from "./auth-services.js";
import type {Request, Response} from "express";
import ApiResponseClass from "../../utils/api-response-class.js";
import {clearRefreshTokenCookie, setRefreshTokenCookie} from "./auth-utils/auth-cookie-config.js";
import ApiErrorClass from "../../utils/api-error-class.js";
import {refreshTokenService} from "./auth-services.js";

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

//refresh token controller
export const refreshTokenController = async (req: Request, res: Response) => {
    const token = req.cookies?.REFRESH_TOKEN_COOKIE
    if (!token) throw ApiErrorClass.unauthorized("Refresh token missing")
    const response = await auth_Service.refreshTokenService(token)

    setRefreshTokenCookie(res, response.newRefreshToken)
    return ApiResponseClass.ok(res, "User refresh token successfully renewed", {accessToken: response.newAccessToken})
}

//get-me controller
export const getMeController = async (req: Request, res: Response) => {
    if(!req.userId) throw ApiErrorClass.unauthorized()
    const response = await auth_Service.getMeService(req.userId)
    return ApiResponseClass.ok(res, "User fetched successfully ", response)
}

export const logoutController = async (req: Request, res: Response) => {
    const token = req.cookies?.REFRESH_TOKEN_COOKIE
    if (!token) throw ApiErrorClass.unauthorized("Refresh token missing")

    await auth_Service.logoutService(token)
    clearRefreshTokenCookie(res)

    return ApiResponseClass.ok(res, "Logged out successfully")

}