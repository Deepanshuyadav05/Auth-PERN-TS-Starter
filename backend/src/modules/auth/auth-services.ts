import type {LoginSchemaType, SignupSchemaType} from "./auth-validations.js";
import {refreshTokenTable, userTable, userTokenTable} from "../../db/schema.js";
import {db} from "../../db/index.js";
import {and, eq, isNull} from "drizzle-orm";
import ApiErrorClass from "../../utils/api-error-class.js";
import {generateToken, hashToken} from "./auth-utils/auth-token.js"
import {comparePassword, DUMMY_HASH, hashPassword} from "./auth-utils/auth-bcrypt.js"
import {sendVerificationEmail} from "./auth-utils/auth-emails.js";
import {generateAccessToken, generateRefreshToken} from "./auth-utils/auth-jwt.js";

//signup
export const SignupService = async({ name, email, password }:SignupSchemaType) => {
    const user = await db.select().from(userTable).where(eq(userTable.email, email)).limit(1)
    if (user.length > 0) throw ApiErrorClass.conflict("User already exists");

    const passwordHash = await hashPassword(password)
    const emailVerificationToken = generateToken()
    const tokenHash = hashToken(emailVerificationToken)

    const userData = await db.transaction(async (tx) => {

        //The .returning() clause at the end of a Drizzle query tells the database to send back the data it just modified or inserted.
        const [newUser] = await tx.insert(userTable).values({name, email, passwordHash}).returning()
        if(!newUser) throw ApiErrorClass.internalServerError("Failed to create user");

        const expiresAtTime = new Date(Date.now() + 24 * 60 * 60 * 1000)
        await tx.insert(userTokenTable).values({userId: newUser.id, type: "email_verification", tokenHash, expiresAt: expiresAtTime})

        return newUser;
    })


    try {
        await sendVerificationEmail(email, name, emailVerificationToken)

    }catch(err){
        console.error("Verification email failed:", err);
        await db.delete(userTable).where(eq(userTable.id, userData.id))
        throw ApiErrorClass.internalServerError("Registration failed because the verification email could not be sent. Please try again.");
    }

    //- passwordHash: _ — pulls the passwordHash field out and names it _ (a throwaway variable name, by convention meaning "I don't need this, I'm just discarding it")
    //...safeUser — the rest operator collects everything else from user (id, name, email, createdAt, updatedAt) into a new object called safeUser
    const {passwordHash:_, ...safeUserData} = userData;

    return safeUserData;

}

//email-verify
export const EmailVerificationService = async(token:string) => {
    const verifyTokenHash:string = hashToken(token)

    // it takes the first element of the array and puts it in tokenRow
    const [tokenRow] = await db.select().from(userTokenTable).where(and(eq(userTokenTable.tokenHash, verifyTokenHash), eq(userTokenTable.type, "email_verification"))).limit(1)

    if(!tokenRow || tokenRow.expiresAt < new Date()){
        //if we have token, but we are still in this if block then the token is expired and we can clear the tokenRow for cleanup
        if (tokenRow) await db.delete(userTokenTable).where(eq(userTokenTable.id, tokenRow.id))
        throw ApiErrorClass.badRequest("Invalid or expired verification link")
    }

    const updatedUser = await db.transaction(async (tx) => {
        const [user] = await tx.update(userTable).set({isEmailVerified: true}).where(eq(userTable.id, tokenRow.userId)).returning()
        //if we have verified the email then we can clean up the tokenRow
        await tx.delete(userTokenTable).where(eq(userTokenTable.id, tokenRow.id))

        return user;
    })

    if(!updatedUser) throw ApiErrorClass.notFound("User not found");
    const { passwordHash: _, ...safeUserData } = updatedUser;
    return safeUserData;
}

//Login
export const loginService = async({email, password}:LoginSchemaType) => {
    const [user] = await db.select().from(userTable).where(eq(userTable.email, email)).limit(1)

    if(!user) {
        await comparePassword(password, DUMMY_HASH)
        throw ApiErrorClass.unauthorized("Invalid credentials");
    }

    const isMatch = await comparePassword(password, user.passwordHash)
    if(!isMatch) throw ApiErrorClass.unauthorized("Invalid credentials");

    const isVerified = user.isEmailVerified
    if(!isVerified) throw ApiErrorClass.forbidden("Email not verified. Please verify your email before logging in.");

    const accessToken = generateAccessToken(user.id)
    const refreshToken = generateRefreshToken(user.id)
    const hashedRefreshToken = hashToken(refreshToken)

    await db.insert(refreshTokenTable).values({
        userId: user.id,
        tokenHash: hashedRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    })

    const { passwordHash: _, ...safeUserData } = user

    return {user : safeUserData, accessToken, refreshToken};



}

//refreshToken
export const refreshToken = async(token:string) => {
    const hashedRefreshToken = hashToken(token)
    const [refreshTokenRow] = await db.select().from(refreshTokenTable).where(eq(refreshTokenTable.tokenHash, hashedRefreshToken)).limit(1)

    if(!refreshTokenRow) throw ApiErrorClass.unauthorized("Invalid or expired token");

    // token was real but already used -> someone else has a copy, kill all sessions of this user
    if(refreshTokenRow.revokedAt){
        await db.update(refreshTokenTable).set({revokedAt: new Date()}).where(and(eq(refreshTokenTable.userId, refreshTokenRow.userId), isNull(refreshTokenTable.revokedAt)))
        throw ApiErrorClass.unauthorized("Token reuse detected. Please login again.");
    }

    if(refreshTokenRow.expiresAt < new Date()) throw ApiErrorClass.unauthorized("Invalid or expired token");

    const newRefreshToken = generateRefreshToken(refreshTokenRow.userId)
    const newAccessToken = generateAccessToken(refreshTokenRow.userId)

    await db.transaction(async (tx) => {
        await tx.update(refreshTokenTable).set({revokedAt: new Date()}).where(eq(refreshTokenTable.id, refreshTokenRow.id))
        await tx.insert(refreshTokenTable).values({
            userId: refreshTokenRow.userId,
            tokenHash: hashToken(newRefreshToken),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        })
    })

    return {newAccessToken, newRefreshToken}
}