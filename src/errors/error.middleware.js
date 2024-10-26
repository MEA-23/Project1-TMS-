import { ErrorHandlerClass } from "./error.class";
export const errorHandle = (API) => {
    return (req, res, next) => {
        API(req, res, next).catch((err) => {
            console.error("Error in Handle Middleware", err);
            const data = "API DATA";
            next(new ErrorHandlerClass(err.message || "Internal Server Error", 500, err.stack, data));
        });
    };
};
export const globalResponse = (err, message, req, res, next) => {
    if (err) {
        res.status(err.statusCode || 500).json({
            message: message || err.message || "Internal Server Error",
            error: err.message,
            stack: err.stack,
            data: err.data,
        });
    }
    else {
        next();
    }
};
