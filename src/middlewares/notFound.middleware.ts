import { ErrorHandlerClass } from "../errors/error.class";
import { Request, Response, NextFunction } from "express";

export const notFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next(new ErrorHandlerClass("Not Found", 404, null, "API DATA"));
};
