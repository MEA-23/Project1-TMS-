import { ErrorHandlerClass } from "../errors/error.class";
import User from "./user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });
        res.status(201).json(newUser);
    }
    catch (error) {
        next(new ErrorHandlerClass("Internal Server Error", 500, error.stack, "API DATA"));
    }
};
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || "your_jwt_secret");
        res.json({ token });
    }
    catch (error) {
        next(new ErrorHandlerClass("Internal Server Error", 500, error.stack, "API DATA"));
    }
};
