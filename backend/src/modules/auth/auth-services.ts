import type {SignupSchemaType} from "./auth-validations.js";
import {userTable, userTokenTable} from "../../db/schema.js";
import {db} from "../../db/index.js";
import {eq} from "drizzle-orm";
import ApiErrorClass from "../../utils/api-error-class.js";
import {generateToken, hashPassword, hashToken} from "./auth-utils.js"
import {sendVerificationEmail} from "./auth-emails.js";

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