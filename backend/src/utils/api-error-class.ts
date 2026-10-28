class ApiErrorClass extends Error {
    statusCode: number;
    errors: unknown[];

    constructor(statusCode: number, message: string, errors: unknown[] = []) {
        super(message);
        this.name = "ApiError";
        this.statusCode = statusCode;
        this.errors = errors;
    }

    static badRequest(message = "Bad request", errors: unknown[] = []): ApiErrorClass {
        return new ApiErrorClass(400, message, errors);
    }

    static unauthorized(message = "Unauthorized"): ApiErrorClass {
        return new ApiErrorClass(401, message);
    }

    static forbidden(message = "Forbidden"): ApiErrorClass {
        return new ApiErrorClass(403, message);
    }

    static notFound(message = "Not found"): ApiErrorClass {
        return new ApiErrorClass(404, message);
    }

    static conflict(message = "Conflict"): ApiErrorClass {
        return new ApiErrorClass(409, message);
    }

    static internalServerError(message = "Internal Server Error"): ApiErrorClass {
        return new ApiErrorClass(500, message);
    }

    static tooManyRequests(message = "Too many requests"): ApiErrorClass {
        return new ApiErrorClass(429, message);
    }
}

export default ApiErrorClass;