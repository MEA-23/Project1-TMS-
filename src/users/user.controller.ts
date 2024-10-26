import { Request, Response, NextFunction } from "express";
import { ErrorHandlerClass } from "../errors/error.class";
import User from "./user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import Session from "./session.model";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let { name, email, password } = req.body;
    email = email.toLowerCase();
    const user = await User.findOne({ email });
    if (user) {
      return next(
        new ErrorHandlerClass(
          "User already exists",
          400,
          "User already exists",
          "API DATA"
        )
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const sessionId = uuidv4();
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const newSession = await Session.create({ sessionId, userId: newUser._id });

    newUser.sessionId = [newSession._id as any];
    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role, sessionId: newSession._id },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "7d" }
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
    let { email, password } = req.body;
    email = email.toLowerCase();
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
    const newSession = await Session.create({ sessionId, userId: user._id });
    user.sessionId.push(newSession._id as any);
    await user.save();
    const token = jwt.sign(
      { userId: user._id, role: user.role, sessionId: newSession._id },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "7d" }
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

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    user.sessionId = user.sessionId.filter(
      (sessionId: string) => sessionId !== req?.sessionId
    );
    await user.save();
    res.json({ message: "Logged out successfully" });
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

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user.toObject();
    delete user.password;
    delete user.sessionId;
    delete user.__v;
    res.json(user);
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
