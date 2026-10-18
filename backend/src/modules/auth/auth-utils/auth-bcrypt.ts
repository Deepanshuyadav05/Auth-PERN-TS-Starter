import bcrypt from "bcryptjs";

// module level, near the imports — a REAL 60-char bcrypt hash, computed once at startup
export const DUMMY_HASH = await bcrypt.hash("timing-equalizer-dummy-password", 12);

// bcrypt: for passwords only
export async function hashPassword(password: string) {
    return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, dbPassword: string) {
    return bcrypt.compare(password, dbPassword);
}