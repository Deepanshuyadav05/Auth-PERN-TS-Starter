import type{Response, CookieOptions} from "express";

const refreshTokenCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: "strict",
    // Your router is mounted at /api/auth, so path: "/api/auth" stops the refresh token from being sent with every other request
    //Path option restricts which URL paths on your website are allowed to receive and read the cookie.
    path: "/api/auth"

}

export const setRefreshTokenCookie = (res:Response, refreshToken:string) => {
    res.cookie("REFRESH_TOKEN_COOKIE", refreshToken, {
        ...refreshTokenCookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
}

export const clearRefreshTokenCookie = (res: Response) => {
    res.clearCookie("REFRESH_TOKEN_COOKIE", refreshTokenCookieOptions)
}