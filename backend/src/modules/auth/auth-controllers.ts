import * as auth_Service from "./auth-services.js";
import type {Request, Response} from "express";
import ApiResponseClass from "../../utils/api-response-class.js";
import {clearRefreshTokenCookie, setRefreshTokenCookie} from "./auth-utils/auth-cookie-config.js";
import ApiErrorClass from "../../utils/api-error-class.js";

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

//logout controller
export const logoutController = async (req: Request, res: Response) => {
    const token = req.cookies?.REFRESH_TOKEN_COOKIE
    if (!token) throw ApiErrorClass.unauthorized("Refresh token missing")

    await auth_Service.logoutService(token)
    clearRefreshTokenCookie(res)

    return ApiResponseClass.ok(res, "Logged out successfully")

}

//forgot password controller
export const forgotPasswordController = async (req: Request, res: Response) => {
    await auth_Service.forgotPasswordService(req.body.email)
    return ApiResponseClass.ok(res, "If an account with that email exists, a reset link has been sent")
}

//reset password controller
export const resetPasswordController = async (req: Request, res: Response) => {
    //the token is in body because the link points to the frontend page and frontend will extract the token from the url
    await auth_Service.resetPasswordService(req.body.token, req.body.newPassword)
    //we clear the cookie because the service revokes all the sessions
    clearRefreshTokenCookie(res)
    return ApiResponseClass.ok(res, "Password reset successfully. Please login again")
}

//resend email verify controller
export const resendVerificationController = async (req: Request, res: Response) => {
    await auth_Service.resendEmailVerifyService(req.body.email)
    return ApiResponseClass.ok(res, "If an account with that email exists, a verification link has been sent")
}