import { Router } from "express";
import { authorization } from "../auth/authorization.middleware";
import {
  createTask,
  deleteTask,
  getTask,
  getAllTasks,
  updateTask,
  updateTaskStatus,
} from "./task.controller";
import { validationMiddleware } from "../middlewares/validation.middleware";
import {
  getAllTasksSchema,
  getTaskByIdSchema,
  createTaskSchema,
  updateTaskSchema,
  deleteTaskSchema,
  updateTaskStatusSchema,
} from "./task.schema";
import { auth } from "../auth/auth.middleware";
import { errorHandle } from "../errors/error.middleware";

const router = Router();

router.get(
  "/",
  auth,
  validationMiddleware(getAllTasksSchema),
  errorHandle(getAllTasks)
);
router.get(
  "/:id",
  auth,
  validationMiddleware(getTaskByIdSchema),
  errorHandle(getTask)
);
router.post(
  "/",
  auth,
  authorization(["admin"]),
  validationMiddleware(createTaskSchema),
  errorHandle(createTask)
);
router.put(
  "/:id",
  auth,
  authorization(["admin"]),
  validationMiddleware(updateTaskSchema),
  errorHandle(updateTask)
);
router.delete(
  "/:id",
  auth,
  authorization(["admin"]),
  validationMiddleware(deleteTaskSchema),
  errorHandle(deleteTask)
);

router.put(
  "/update-status/:id",
  auth,
  validationMiddleware(updateTaskStatusSchema),
  errorHandle(updateTaskStatus)
);

export default router;
