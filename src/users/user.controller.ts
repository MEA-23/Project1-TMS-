import { Request, Response, NextFunction } from "express";
import { ErrorHandlerClass } from "../errors/error.class";
import User from "./user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const sessionId = uuidv4();
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      sessionId: [sessionId],
    });

    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role, sessionId },
      process.env.JWT_SECRET || "your_jwt_secret"
    );

    res.status(201).json({ jwt: token });
  } catch (error) {
    next(
      new ErrorHandlerClass(
        "Internal Server Error",
        500,
        (error as Error).stack,
        "API DATA"
      )
    );
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(
        new ErrorHandlerClass(
          "Invalid email or password",
          400,
          "Invalid email or password",
          "API DATA"
        )
      );
    }

    const sessionId = uuidv4();
    user.sessionId.push({ sessionId });
    await user.save();
    const token = jwt.sign(
      { userId: user._id, role: user.role, sessionId },
      process.env.JWT_SECRET || "your_jwt_secret"
    );

    res.json({ jwt: token });
  } catch (error) {
    next(
      new ErrorHandlerClass(
        "Internal Server Error",
        500,
        (error as Error).stack,
        "API DATA"
      )
    );
  }
};
