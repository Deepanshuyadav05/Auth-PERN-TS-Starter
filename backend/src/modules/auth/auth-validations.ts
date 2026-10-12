import {z} from "zod"

const emailSchema = z.email("Invalid email address")
    .trim()
    .toLowerCase()


const passwordSchema = z.string()
    .min(8, "Password must be at least 8 characters")
    .max(68, "Password must be at most 68 characters")


export const signupSchema = z.object({
    name: z.string()
        .trim()
        .min(3, "Name should be at least 3 characters")
        .max(35, "Name should be at most 35 characters"),
    email: emailSchema,
    password: passwordSchema,
})
export type signupSchemaType = z.infer<typeof signupSchema>


export const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
})

export type loginSchemaType = z.infer<typeof loginSchema>