import Joi from "joi";

export const createTaskSchema = {
  body: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    assignedTo: Joi.string().length(24).hex().required(),
    completed: Joi.boolean().optional(),
  }),
};

export const updateTaskSchema = {
  body: Joi.object({
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    assignedTo: Joi.string().length(24).hex().optional(),
    completed: Joi.boolean().optional(),
  }).min(1),
  params: Joi.object({
    id: Joi.string().length(24).hex().required(),
  }),
};

export const getTaskByIdSchema = {
  params: Joi.object({
    id: Joi.string().length(24).hex().required(),
  }),
};

export const getAllTasksSchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
  }),
};

export const deleteTaskSchema = {
  params: Joi.object({
    id: Joi.string().length(24).hex().required(),
  }),
};

export const assignTaskSchema = {
  body: Joi.object({
    userId: Joi.string().length(24).hex().required(),
    taskId: Joi.string().length(24).hex().required(),
  }),
};

export const unassignTaskSchema = {
  body: Joi.object({
    userId: Joi.string().length(24).hex().required(),
    taskId: Joi.string().length(24).hex().required(),
  }),
};

export const completeTaskSchema = {
  body: Joi.object({
    id: Joi.string().length(24).hex().required(),
  }),
};

export const uncompleteTaskSchema = {
  body: Joi.object({
    id: Joi.string().length(24).hex().required(),
  }),
};

export const updateTaskStatusSchema = {
  body: Joi.object({
    status: Joi.string().valid("completed", "pending").required(),
  }),
  params: Joi.object({
    id: Joi.string().length(24).hex().required(),
  }),
};

export const getTaskByStatusSchema = {
  body: Joi.object({
    status: Joi.string().valid("completed", "pending").required(),
  }),
};
