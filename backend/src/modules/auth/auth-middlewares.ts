import type {Response, Request, NextFunction} from "express";
import ApiErrorClass from "../../utils/api-error-class.js";
import {verifyAccessToken} from "./auth-utils/auth-jwt.js";

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
    let token;

    if(req.headers.authorization?.startsWith("Bearer ")){
        token = req.headers.authorization?.split(" ")[1];
    }
    if (!token) {
        throw ApiErrorClass.unauthorized("Invalid or expired token")
    }

    try {
        const payload = verifyAccessToken(token)
        //type checking because verifyAccessToken return a jwtPayload only but payload can be a sting too
        if (typeof payload === "string" || typeof payload.userId !== "string") throw ApiErrorClass.unauthorized("Invalid token")
        req.userId = payload.userId
    }
    catch(err){
        throw ApiErrorClass.unauthorized("Invalid or expired token")
    }
    next()


}