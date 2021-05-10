import { Request, Response } from "express";
import { Types } from "mongoose";
import { validator } from "../shared";
import { TemplateModel, TaskModel, UserModel } from "../models";
import { ITask } from "../interfaces";

class TemplateController {
  static async getByUser(req: Request, res: Response) {
    const { userId } = req;

    if (!userId) {
      return res.status(401).send("Unauthorized");
    }
    if (!Types.ObjectId.isValid(userId)) {
      return res.status(400).send("Invalid user id received");
    }

    try {
      const userFound = await UserModel.findById(userId).exec();
      if (!userFound) return res.status(400).send(`User with id ${userId} not found`);
      const templatesFound = await TemplateModel.find({ _id: { $in: userFound.templates } })
        .populate("tasks")
        .exec();
      return res.status(200).json({ templates: templatesFound, count: templatesFound.length });
    } catch (error) {
      return res.status(500).json({ message: error.message, error });
    }
  }

  static async get(req: Request, res: Response) {
    const { templateId } = req.params;

    try {
      const result = await TemplateModel.findById(templateId).populate("tasks").exec();
      return res.status(200).json({ template: result });
    } catch (error) {
      return res.status(500).json({ message: error.message, error });
    }
  }

  static async create(req: Request, res: Response) {
    const { userId } = req;
    const { name, description } = req.body;

    if (!Types.ObjectId.isValid(userId)) {
      return res.status(400).send("Invalid user id received");
    }
    const validationBody = validator.validateObjectKeys(req.body, "name description");
    if (!validationBody.isOk) {
      return res.status(400).send(validationBody.message);
    }

    try {
      const userFound = await UserModel.findById(userId).exec();
      if (!userFound) return res.status(201).json("User with id not found");
      const templateCreated = await TemplateModel.create({
        _id: new Types.ObjectId(),
        name,
        description,
      });
      userFound.templates.push(templateCreated._id);
      await userFound.save();

      return res.status(201).json({ template: templateCreated });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
        error,
      });
    }
  }

  static async update(req: Request, res: Response) {
    const { templateId } = req.params;
    const { name, description } = req.body;

    if (!Types.ObjectId.isValid(templateId)) {
      return res.status(400).send("Invalid user id received");
    }
    const validationBody = validator.validateObjectKeys(req.body, "name description");
    if (!validationBody.isOk) {
      return res.status(400).send(validationBody.message);
    }

    try {
      const result = await TemplateModel.findByIdAndUpdate(
        templateId,
        { name, description },
        { new: true },
      )
        .populate("tasks")
        .exec();

      return res.status(200).json({ template: result });
    } catch (error) {
      return res.status(500).json({ message: error.message, error });
    }
  }

  static async updateTasksIndexes(req: Request, res: Response) {
    const { templateId } = req.params;
    const { tasks } = req.body;

    if (!Types.ObjectId.isValid(templateId)) {
      return res.status(400).send("Invalid user id received");
    }
    if (!Array.isArray(tasks)) {
      return res.status(400).send("Invalid tasks received");
    }

    try {
      const tasksId: string[] = (tasks as ITask[]).map((task) => task._id);
      const templateToUpdate = await TemplateModel.findById(templateId).exec();
      if (!templateToUpdate) {
        return res.status(400).send(`Template with id ${templateId} not found`);
      }

      const tasksIdToUpdate = templateToUpdate.tasks as string[];

      const isValidTasks =
        tasksIdToUpdate.every((taskId) => tasksId.includes(taskId.toString())) &&
        tasksIdToUpdate.length === tasksId.length;
      if (!isValidTasks) return res.status(400).send("Invalid tasks id received");

      templateToUpdate.tasks = [...tasksId];
      await templateToUpdate.save();
      const result = await templateToUpdate.populate("tasks").execPopulate();

      return res.status(200).json({ template: result });
    } catch (error) {
      return res.status(500).json({ message: error.message, error });
    }
  }

  static async delete(req: Request, res: Response) {
    const { templateId } = req.params;

    if (!Types.ObjectId.isValid(templateId)) {
      return res.status(400).send("Invalid template id received");
    }

    try {
      const templateFound = await TemplateModel.findById(templateId).exec();
      if (!templateFound) return res.status(400).send(`Template with id ${templateId} not found`);

      await TaskModel.deleteMany({ _id: { $in: templateFound.tasks } }).exec();
      await UserModel.findOneAndUpdate(
        { templates: templateFound._id },
        { $pull: { templates: templateFound._id } },
      ).exec();
      const result = await TemplateModel.deleteOne({ _id: templateId }).exec();

      return res.status(200).json({ result });
    } catch (error) {
      return res.status(500).json({ message: error.message, error });
    }
  }
}

export default TemplateController;
