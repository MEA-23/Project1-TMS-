import { ErrorHandlerClass } from "../errors/error.class";
const reqKeys = ["body", "params", "query", "headers"];
export const validationMiddleware = (schema) => {
    return (req, res, next) => {
        var _a;
        const validationErrors = [];
        for (const key of reqKeys) {
            const validationResult = (_a = schema[key]) === null || _a === void 0 ? void 0 : _a.validate(req[key], {
                abortEarly: false,
            });
            if (validationResult === null || validationResult === void 0 ? void 0 : validationResult.error) {
                validationErrors.push(validationResult.error.details);
            }
        }
        validationErrors.length
            ? next(new ErrorHandlerClass("Validation Error", 400, null, validationErrors[0]))
            : next();
    };
};
