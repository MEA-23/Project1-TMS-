var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import User from "../users/user.model.js";
import { ErrorHandlerClass } from "../errors/error.class";
import jwt from "jsonwebtoken";
export const auth = () => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const { token } = req.headers;
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
            const decodedData = jwt.verify(originalToken, process.env.JWT_SECRET);
            if (!(decodedData === null || decodedData === void 0 ? void 0 : decodedData._id)) {
                return next(new ErrorHandlerClass("Invalid Token Payload", 400, "Invalid Token Payload"));
            }
            const user = yield User.findById(decodedData._id)
                .populate("sessionId")
                .select("-password");
            if (!user) {
                return next(new ErrorHandlerClass("Please sign up", 400, "Please sign up"));
            }
            const validSession = (_a = user.sessionId) === null || _a === void 0 ? void 0 : _a.some((session) => session.sessionId === decodedData.sessionId);
            if (!validSession) {
                return next(new ErrorHandlerClass("Please login again", 400, "Please login again"));
            }
            req.authUser = user;
            next();
        }
        catch (error) {
            console.log(error.message);
            return next(new ErrorHandlerClass("Invalid Token", 401, "Invalid Token"));
        }
    });
};
