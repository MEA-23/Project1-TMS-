import { Request, Response, NextFunction } from "express";
import { ErrorHandlerClass } from "../errors/error.class";
import Task from "./task.model";

export const getAllTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const isAdmin = req.user.role === "admin";
  try {
    const [tasks, totalTasks] = await Promise.all([
      Task.find(isAdmin ? {} : { assignedTo: req.user._id })
        .skip((page - 1) * limit)
        .limit(limit),
      Task.countDocuments(isAdmin ? {} : { assignedTo: req.user._id }),
    ]);

    res.json({
      totalTasks,
      totalPages: Math.ceil(totalTasks / limit),
      currentPage: page,
      tasks,
    });
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

export const getTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const isAdmin = req.user.role === "admin";
    const task = await Task.findOne({
      _id: req.params.id,
      ...(isAdmin ? {} : { assignedTo: req.user._id }),
    });
    if (!task) {
      return next(
        new ErrorHandlerClass(
          `Task not found with id ${req.params.id}`,
          404,
          "API DATA"
        )
      );
    }
    res.json(task);
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

export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const task = await Task.create({ ...req.body, addedBy: req.user._id });
    res.status(201).json(task);
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

export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!task) {
      return next(
        new ErrorHandlerClass(
          `Task not found with id ${req.params.id}`,
          404,
          "API DATA"
        )
      );
    }
    res.json(task);
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

export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return next(
        new ErrorHandlerClass(
          `Task not found with id ${req.params.id}`,
          404,
          "API DATA"
        )
      );
    }
    res.json({ message: "Task deleted successfully" });
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

export const getTaskByStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const isAdmin = req.user.role === "admin";
    const tasks = await Task.find({
      status: req.params.status,
      ...(isAdmin ? {} : { assignedTo: req.user._id }),
    });
    res.json(tasks);
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

export const updateTaskStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const isAdmin = req.user.role === "admin";
    const status = !!(req.body.status == "completed");
    console.log(status);
    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        ...(isAdmin ? {} : { assignedTo: req.user._id }),
      },
      { completed: status },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!task) {
      return next(
        new ErrorHandlerClass(
          `Task not found with id ${req.params.id}`,
          404,
          "API DATA"
        )
      );
    }
    res.json(task);
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
