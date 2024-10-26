import express, { Application, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";

import taskRoutes from "./tasks/task.routes";
import userRoutes from "./users/user.routes";
import { globalResponse } from "./errors/error.middleware";
import { notFoundMiddleware } from "./middlewares/notFound.middleware";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Database Connection
mongoose
  .connect(process.env.DB_Link as string)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Routes
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

// Error Handling
app.use(notFoundMiddleware);
app.use(globalResponse);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
