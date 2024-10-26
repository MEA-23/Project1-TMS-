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
} from "./task.schema";
import { auth } from "../auth/auth.middleware";

const router = Router();

router.get("/", auth, validationMiddleware(getAllTasksSchema), getAllTasks);
router.get("/:id", auth, validationMiddleware(getTaskByIdSchema), getTask);
router.post("/", auth, validationMiddleware(createTaskSchema), createTask);
router.put("/:id", auth, validationMiddleware(updateTaskSchema), updateTask);
router.delete(
  "/:id",
  auth,
  validationMiddleware(getTaskByIdSchema),
  deleteTask
);

export default router;