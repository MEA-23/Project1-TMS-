import { Router } from "express";

import {
  createTask,
  deleteTask,
  getTask,
  getAllTasks,
  updateTask,
} from "./task.controller";
import { validationMiddleware } from "../middlewares/validation.middleware";
import {
  getAllTasksSchema,
  getTaskByIdSchema,
  createTaskSchema,
  updateTaskSchema,
  deleteTaskSchema,
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
  validationMiddleware(createTaskSchema),
  errorHandle(createTask)
);
router.put(
  "/:id",
  auth,
  validationMiddleware(updateTaskSchema),
  errorHandle(updateTask)
);
router.delete(
  "/:id",
  auth,
  validationMiddleware(deleteTaskSchema),
  errorHandle(deleteTask)
);

export default router;
