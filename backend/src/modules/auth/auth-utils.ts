import bcrypt from "bcryptjs";
import {createHash, randomBytes} from "node:crypto";

// bcrypt: for passwords only
export async function hashPassword(password: string) {
    return bcrypt.hash(password, 12);
}

// random token for email verification, password reset and refresh
export function generateToken(bytes = 32) {
    return randomBytes(bytes).toString("hex");
}

// sha256: for tokens only
export function hashToken(token: string) {
    return createHash("sha256").update(token).digest("hex");
}