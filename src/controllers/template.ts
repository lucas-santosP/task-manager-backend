import { Request, Response } from "express";
import { Types } from "mongoose";
import TemplateModel from "../models/template";
import TaskModel from "../models/task";

class TemplateController {
  static async getAll(req: Request, res: Response) {
    try {
      const result = await TemplateModel.find().populate("tasks").exec();
      return res.status(200).json({ template: result, count: result.length });
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
    const { title, description } = req.body;

    try {
      const result = await TemplateModel.create({ _id: new Types.ObjectId(), title, description });
      return res.status(201).json({ template: result });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
        error,
      });
    }
  }

  static async update(req: Request, res: Response) {
    const { templateId } = req.params;
    const { title, description } = req.body;

    try {
      const result = await TemplateModel.findByIdAndUpdate(templateId, {
        title,
        description,
      }).exec();
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

      for (const taskId of templateFound.tasks) {
        await TaskModel.deleteOne({ _id: taskId });
      }

      const result = await TemplateModel.deleteOne({ _id: templateId }).exec();
      return res.status(200).json({ template: result });
    } catch (error) {
      return res.status(500).json({ message: error.message, error });
    }
  }
}

export default TemplateController;
