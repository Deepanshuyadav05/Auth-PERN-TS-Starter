import jwt from 'jsonwebtoken'
import {randomUUID} from "node:crypto";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
if (!ACCESS_TOKEN_SECRET) throw new Error("ACCESS_TOKEN_SECRET is not set")

export const generateAccessToken = (userId:string)=>{
    return jwt.sign({userId}, ACCESS_TOKEN_SECRET, {expiresIn:"15m"})
}

export const verifyAccessToken = (token:string) => {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
}

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET
if (!REFRESH_TOKEN_SECRET) throw new Error("REFRESH_TOKEN_SECRET is not set")

export const generateRefreshToken = (userId:string)=>{
    return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: "7d", jwtid: randomUUID() });
}

export const verifyRefreshToken = (token:string) => {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
}