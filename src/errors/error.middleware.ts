import { Request, Response, NextFunction } from "express";
import { ErrorHandlerClass } from "./error.class";

type ApiMiddlewareFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export const errorHandle = (API: ApiMiddlewareFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    API(req, res, next).catch((err: Error) => {
      console.error("Error in Middleware:", err);
      next(
        new ErrorHandlerClass(
          err.message || "Internal Server Error",
          500,
          process.env.NODE_ENV === "development" ? err.stack : undefined,
          "API Data"
        )
      );
    });
  };
};

export const globalResponse = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Error log:", err);
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
    error: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    data: err.data || null,
  });
};
