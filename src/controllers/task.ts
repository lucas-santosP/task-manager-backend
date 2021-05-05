import { Request, Response } from "express";
import { Types } from "mongoose";
import { TemplateModel, TaskModel } from "../models";
import { validator } from "../shared";

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
    const { name, status } = req.body;

    if (!Types.ObjectId.isValid(templateId)) {
      return res.status(400).send("Invalid template id received");
    }
    const validationBody = validator.validateObjectKeys(req.body, "name status");
    if (!validationBody.isOk) {
      return res.status(400).send(validationBody.message);
    }
    const validStatus = ["to do", "doing", "done"];
    if (!validStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid field status" });
    }

    try {
      const templateFound = await TemplateModel.findById(templateId).exec();
      if (!templateFound) return res.status(400).send(`Template with id ${templateId} not found`);

      const taskCreated = await TaskModel.create({
        _id: new Types.ObjectId(),
        name,
        status,
      });
      templateFound.tasks.push(taskCreated._id);
      await templateFound.save();
      return res.status(200).json({ task: taskCreated });
    } catch (error) {
      return res.status(500).json({ message: error.message, error });
    }
  }

  static async update(req: Request, res: Response) {
    const { taskId } = req.params;
    const { name, status } = req.body;

    if (!Types.ObjectId.isValid(taskId)) {
      return res.status(400).send("Invalid task id received");
    }
    const validationBody = validator.validateObjectKeys(req.body, "name status");
    if (!validationBody.isOk) {
      return res.status(400).send(validationBody.message);
    }
    const validStatus = ["to do", "doing", "done"];
    if (!validStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid field status" });
    }

    try {
      const taskUpdated = await TaskModel.findByIdAndUpdate(
        taskId,
        { name, status },
        { new: true },
      ).exec();
      return res.status(200).json({ task: taskUpdated });
    } catch (error) {
      return res.status(500).json({ message: error.message, error });
    }
  }

  static async delete(req: Request, res: Response) {
    const { taskId } = req.params;

    if (!Types.ObjectId.isValid(taskId)) {
      return res.status(400).send("Invalid task id received");
    }

    try {
      const taskFound = await TaskModel.findById(taskId).exec();
      if (!taskFound) return res.status(400).send(`Task with id ${taskId} not found`);

      await TemplateModel.findOneAndUpdate(
        { templates: taskFound._id },
        { $pull: { tasks: taskFound._id } },
      ).exec();
      const result = await TaskModel.deleteOne({ _id: taskId }).exec();

      return res.status(200).json({ result });
    } catch (error) {
      return res.status(500).json({ message: error.message, error });
    }
  }
}

export default TaskController;
