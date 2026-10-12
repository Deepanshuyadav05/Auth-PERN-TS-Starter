import type {Request, Response, NextFunction} from "express";
import type {ZodType} from "zod";
import ApiErrorClass from "../utils/api-error-class.js";

const zodValidationMiddleware = (schema : ZodType) => {
    return (req : Request, _res : Response, next : NextFunction) => {
        const result = schema.safeParse(req.body);

        if(!result.success) {
            //explained at bottom
            const errors = result.error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            }));

            throw ApiErrorClass.badRequest("Validation failed", errors);
        }

        req.body = result.data;
        next();
    }
}

export default zodValidationMiddleware;

//When validation fails, Zod gives you result.error.issues, an array with one entry per problem. That code reshapes each entry into a smaller object for your API response.
//
//   For a register body with a bad email and a short password, a raw issue from Zod looks roughly like this:
//
//   [
//     { code: "invalid_format", format: "email", path: ["email"], message: "Invalid email address" },
//     { code: "too_small", minimum: 8, origin: "string", path: ["password"], message: "Too small: expected string to have >=8 characters" }
//   ]

//   - .map((issue) => ({ ... })) turns each issue into a new object. The parentheses around { ... } are needed so JavaScript reads it as an object to return, not as a function body.
//   - issue.path.join(".") converts the path to a string. path is an array because the field can be nested: ["email"] becomes "email", and ["address", "city"] becomes "address.city".
//   - message: issue.message keeps the human-readable message and drops the rest (code, minimum, and so on).
//
// The result is what your frontend receives:
//
//   [
//     { field: "email", message: "Invalid email address" },
//     { field: "password", message: "Too small: expected string to have >=8 characters" }
//   ]