import { Request, Response, NextFunction } from "express";

declare module "express-serve-static-core" {
  interface Request {
    authUser?: any;
  }
}
import User from "../users/user.model.js";
import { ErrorHandlerClass } from "../errors/error.class";
import jwt, { JwtPayload } from "jsonwebtoken";

interface DecodedToken extends JwtPayload {
  _id: string;
  sessionId?: string;
}

export const auth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const token = req.headers.token as string;

    if (!token) {
      return res
        .status(400)
        .json({ message: "Unauthenticated, Please sign in first." });
    }

    if (!token.startsWith("bearer") || !token.split(" ")[1]) {
      return next(new ErrorHandlerClass("Invalid Token", 401, "Invalid Token"));
    }

    const originalToken = token.split(" ")[1];

    if (!originalToken) {
      return next(new ErrorHandlerClass("Invalid Token", 401, "Invalid Token"));
    }

    const decodedData = jwt.verify(
      originalToken,
      process.env.JWT_SECRET as string
    ) as DecodedToken;

    if (!decodedData?._id) {
      return next(
        new ErrorHandlerClass(
          "Invalid Token Payload",
          400,
          "Invalid Token Payload"
        )
      );
    }

    const user = await User.findById(decodedData._id)
      .populate("sessionId")
      .select("-password");

    if (!user) {
      return next(
        new ErrorHandlerClass("Please sign up", 400, "Please sign up")
      );
    }

    const validSession = user.sessionId?.some(
      (session: any) => session.sessionId === decodedData.sessionId
    );

    if (!validSession) {
      return next(
        new ErrorHandlerClass("Please login again", 400, "Please login again")
      );
    }

    req.authUser = user;
    next();
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log("An unknown error occurred");
    }
    return next(new ErrorHandlerClass("Invalid Token", 401, "Invalid Token"));
  }
};
