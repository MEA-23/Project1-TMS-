var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ErrorHandlerClass } from "../errors/error.class";
import Task from "./task.model";
export const getAllTasks = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    try {
        const [tasks, totalTasks] = yield Promise.all([
            Task.find()
                .skip((page - 1) * limit)
                .limit(limit),
            Task.countDocuments(),
        ]);
        res.json({
            totalTasks,
            totalPages: Math.ceil(totalTasks / limit),
            currentPage: page,
            tasks,
        });
    }
    catch (error) {
        next(new ErrorHandlerClass("Internal Server Error", 500, error.stack, "API DATA"));
    }
});
export const getTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = yield Task.findById(req.params.id);
        if (!task) {
            return next(new ErrorHandlerClass(`Task not found with id ${req.params.id}`, 404, "API DATA"));
        }
        res.json(task);
    }
    catch (error) {
        next(new ErrorHandlerClass("Internal Server Error", 500, error.stack, "API DATA"));
    }
});
export const createTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = yield Task.create(req.body);
        res.status(201).json(task);
    }
    catch (error) {
        next(new ErrorHandlerClass("Internal Server Error", 500, error.stack, "API DATA"));
    }
});
export const updateTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = yield Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!task) {
            return next(new ErrorHandlerClass(`Task not found with id ${req.params.id}`, 404, "API DATA"));
        }
        res.json(task);
    }
    catch (error) {
        next(new ErrorHandlerClass("Internal Server Error", 500, error.stack, "API DATA"));
    }
});
export const deleteTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = yield Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return next(new ErrorHandlerClass(`Task not found with id ${req.params.id}`, 404, "API DATA"));
        }
        res.json({ message: "Task deleted successfully" });
    }
    catch (error) {
        next(new ErrorHandlerClass("Internal Server Error", 500, error.stack, "API DATA"));
    }
});
export const getTaskByStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield Task.find({ status: req.params.status });
        res.json(tasks);
    }
    catch (error) {
        next(new ErrorHandlerClass("Internal Server Error", 500, error.stack, "API DATA"));
    }
});
