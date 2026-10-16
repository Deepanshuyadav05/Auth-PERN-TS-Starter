import {z} from "zod"

const emailSchema = z.string({ error: "Email is required" })
    .trim()
    .toLowerCase()
    .pipe(z.email("Invalid email address"))


const passwordSchema = z.string({ error: "Password is required" })
    .min(8, "Password must be at least 8 characters")
    .max(68, "Password must be at most 68 characters")


export const signupSchema = z.object({
    name: z.string({ error: "Name is required" })
        .trim()
        .min(3, "Name should be at least 3 characters")
        .max(35, "Name should be at most 35 characters"),
    email: emailSchema,
    password: passwordSchema,
})
export type SignupSchemaType = z.infer<typeof signupSchema>


export const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
})

export type LoginSchemaType = z.infer<typeof loginSchema>