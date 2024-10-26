import User from "../users/user.model.js";
import { ErrorHandlerClass } from "../errors/error.class";
import jwt from "jsonwebtoken";
export const auth = () => {
  return async (req, res, next) => {
    try {
      const token = req.headers.Authorization;
      console.log("token", token);
      if (!token) {
        return res
          .status(400)
          .json({ message: "Unauthenticated, Please sign in first." });
      }
      if (!token.startsWith("bearer") || !token.split(" ")[1]) {
        return next(
          new ErrorHandlerClass("Invalid Token", 401, "Invalid Token")
        );
      }
      const originalToken = token.split(" ")[1];
      if (!originalToken) {
        return next(
          new ErrorHandlerClass("Invalid Token", 401, "Invalid Token")
        );
      }
      const decodedData = jwt.verify(originalToken, process.env.JWT_SECRET);
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
      const validSession = user.sessionId?.find(
        (session) => session._id === decodedData.sessionId
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
};
