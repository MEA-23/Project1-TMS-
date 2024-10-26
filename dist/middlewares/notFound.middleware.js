import { ErrorHandlerClass } from "../errors/error.class";
export const notFoundMiddleware = (req, res, next) => {
    next(new ErrorHandlerClass("Not Found", 404, null, "API DATA"));
};
