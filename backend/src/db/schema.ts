import {boolean, pgEnum, pgTable, timestamp, uuid, varchar} from "drizzle-orm/pg-core";

export const userTable = pgTable("users", {
    id: uuid().primaryKey().defaultRandom(),
    name: varchar("name", {length: 45}).notNull(),
    email: varchar("email", {length: 322}).notNull().unique(),
    passwordHash: varchar("password_hash", {length: 64}).notNull(),
    isEmailVerified: boolean("is_email_verified").notNull().default(false),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    //.$onUpdate(() => new Date()) tells Drizzle: "whenever I update a row in this table and I don't give a value for this column myself, call this function and use what it returns."
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()) ,

})

export const refreshTokenTable = pgTable("refresh_tokens", {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => userTable.id, {onDelete : "cascade"}),
    tokenHash: varchar("token_hash", {length: 64}).notNull().unique(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    // It's a timestamp that means "this refresh token was cancelled at this time". It's nullable on purpose:
    //we set it on the logout and token rotation
    // The reason to mark the row instead of deleting it is theft detection. Say an attacker steals a refresh token, and the real user then refreshes first, which revokes it. When the attacker tries it:
    //   - If you had deleted the row, you'd only see "unknown token", which tells you nothing.
    //   - With revokedAt set, you see "this token was real and has already been used". That only happens if two parties hold the same token, so you revoke every refresh token for that user and force a new login.
    // If that feels like too much for now, the simpler version is to drop the column and delete the row on logout. You lose the theft detection, but everything else works.
    revokedAt: timestamp("revoked_at", { withTimezone: true }),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),

})

//we need to export the enum for the migration
export const userTokenType =  pgEnum("user_token_type", ["email_verification", "password_reset"])
export const userTokenTable = pgTable("user_tokens", {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => userTable.id, {onDelete : "cascade"}),
    // Left type is the name in your code (token.type).
    //   - userTokenType is the kind of data. Instead of "any text", it's "only email_verification or password_reset".
    //   - "type" in quotes is the column's name inside Postgres.
    type: userTokenType("type").notNull(),
    tokenHash: varchar("token_hash", {length: 64}).notNull().unique(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()

})
