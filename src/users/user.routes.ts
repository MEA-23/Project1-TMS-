import { Router } from "express";
import { register, login, getUser } from "./user.controller";
import { validationMiddleware } from "../middlewares/validation.middleware";
import { registerSchema, loginSchema } from "./user.schema";
import { errorHandle } from "../errors/error.middleware";
import { auth } from "../auth/auth.middleware";

const router = Router();

router.post(
  "/register",
  validationMiddleware(registerSchema),
  errorHandle(register)
);

router.post("/login", validationMiddleware(loginSchema), errorHandle(login));

router.get("/me", auth, errorHandle(getUser));

export default router;
