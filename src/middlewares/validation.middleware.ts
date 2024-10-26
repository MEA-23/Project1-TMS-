import { Request, Response, NextFunction } from "express";
import { ErrorHandlerClass } from "../errors/error.class";
import { Schema } from "joi";

const reqKeys = ["body", "params", "query", "headers"] as const;

export const validationMiddleware = (schema: { [key: string]: Schema }) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const validationErrors: any[] = [];

    for (const key of reqKeys) {
      if (schema[key]) {
        const { error } = schema[key].validate(req[key], { abortEarly: false });
        if (error) {
          validationErrors.push(
            ...error.details.map((detail) => detail.message)
          );
        }
      }
    }

    validationErrors.length
      ? next(
          new ErrorHandlerClass(
            "Validation Error",
            400,
            undefined,
            validationErrors
          )
        )
      : next();
  };
};
