import { Request, Response, NextFunction } from "express";
// import { ISession } from "../users/session.model";
declare module "express-serve-static-core" {
  interface Request {
    user?: any;
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
    const token: any = req.headers.authorization;
    console.log("token", token);

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

    console.log("decodedData", decodedData);

    if (!decodedData?.userId || !decodedData?.sessionId) {
      return next(
        new ErrorHandlerClass(
          "Invalid Token Payload",
          400,
          "Invalid Token Payload"
        )
      );
    }
    const user = await User.findById(decodedData.userId)
      .populate("sessionId")
      .select("-password");
    if (!user) {
      return next(
        new ErrorHandlerClass("Please sign up", 400, "Please sign up")
      );
    }
    const validSession = user.sessionId?.find(
      (session) => session?._id.toString() === decodedData.sessionId
    );
    if (!validSession) {
      return next(
        new ErrorHandlerClass("Please login again", 400, "Please login again")
      );
    }

    req.user = user;
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
