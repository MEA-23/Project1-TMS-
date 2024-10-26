import { Router } from "express";
import { register, login } from "./user.controller";
import { validationMiddleware } from "../middlewares/validation.middleware";
import { registerSchema, loginSchema } from "./user.schema";
import { errorHandle } from "../errors/error.middleware";

const router = Router();

router.post(
  "/register",
  validationMiddleware(registerSchema),
  errorHandle(register)
);

router.post("/login", validationMiddleware(loginSchema), errorHandle(login));

export default router;
