import { ErrorHandlerClass } from "../errors/error.class";
const reqKeys = ["body", "params", "query", "headers"];
export const validationMiddleware = (schema) => {
    return (req, res, next) => {
        const validationErrors = [];
        for (const key of reqKeys) {
            const validationResult = schema[key]?.validate(req, {
                abortEarly: false,
            });
            if (validationResult?.error) {
                validationErrors.push(validationResult.error.details);
            }
        }
        validationErrors.length
            ? next(new ErrorHandlerClass("Validation Error", 400, null, validationErrors[0]))
            : next();
    };
};
