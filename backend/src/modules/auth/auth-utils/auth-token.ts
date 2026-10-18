// random token for email verification, password reset and refresh
import {createHash, randomBytes} from "node:crypto";

export function generateToken(bytes = 32) {
    return randomBytes(bytes).toString("hex");
}

// sha256: for tokens only
export function hashToken(token: string) {
    return createHash("sha256").update(token).digest("hex");
}