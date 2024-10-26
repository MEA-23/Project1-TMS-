import { ErrorHandlerClass } from "../errors/error.class";
import { Request, Response, NextFunction } from "express";

interface CustomRequest extends Request {}

export const authorization = (allowedRules: string | string[]) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    const user = req.user; // logged-in user

    if (!user || !allowedRules.includes(user.role)) {
      return next(
        new ErrorHandlerClass(
          "Authorization Error",
          401,
          "You are not allowed to access this page."
        )
      );
    }

    next();
  };
};
