import { Request, Response } from "express";
import { Types } from "mongoose";
import TemplateModel from "../models/template";
import TaskModel from "../models/task";

class TaskController {
  static async getAll(req: Request, res: Response) {
    try {
      const task = await TaskModel.find().exec();
      return res.status(200).json({ task: task, count: task.length });
    } catch (error) {
      return res.status(500).json({ message: error.message, error });
    }
  }

  static async create(req: Request, res: Response) {
    const { templateId } = req.params;
    const { title, description, status } = req.body;

    if (!Types.ObjectId.isValid(templateId)) {
      return res.status(400).send("Invalid template id received");
    }
    const validStatus = ["to do", "doing", "done"];
    if (!validStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status field" });
    }

    try {
      const templateFound = await TemplateModel.findById(templateId).exec();
      if (!templateFound) return res.status(400).send(`Template with id ${templateId} not found`);

      const taskCreated = await TaskModel.create({
        _id: new Types.ObjectId(),
        title,
        description,
        status,
      });
      templateFound.tasks.push(taskCreated._id);
      templateFound.save();
      return res.status(200).json({ task: taskCreated });
    } catch (error) {
      return res.status(500).json({ message: error.message, error });
    }
  }

  static async update(req: Request, res: Response) {
    const { taskId } = req.params;
    const { title, description, status } = req.body;

    if (!Types.ObjectId.isValid(taskId)) {
      return res.status(400).send("Invalid task id received");
    }

    try {
      const taskUpdated = await TaskModel.findByIdAndUpdate(
        taskId,
        { title, description, status },
        { new: true },
      ).exec();
      return res.status(200).json({ task: taskUpdated });
    } catch (error) {
      return res.status(500).json({ message: error.message, error });
    }
  }

  static async delete(req: Request, res: Response) {
    const { templateId, taskId } = req.params;

    if (!Types.ObjectId.isValid(taskId)) {
      return res.status(400).send("Invalid task id received");
    }
    if (!Types.ObjectId.isValid(templateId)) {
      return res.status(400).send("Invalid template id received");
    }

    try {
      const templateFound = await TemplateModel.findById(templateId).exec();
      const taskFound = await TaskModel.findById(taskId).exec();
      if (!templateFound) return res.status(400).send(`Template with id ${templateId} not found`);
      if (!taskFound) return res.status(400).send(`Task with id ${taskId} not found`);

      await templateFound.update({ $pull: { tasks: taskFound._id } }, { new: true });
      const result = await taskFound.delete();
      return res.status(200).json({ task: result });
    } catch (error) {
      return res.status(500).json({ message: error.message, error });
    }
  }
}

export default TaskController;
