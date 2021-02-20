import { Request, Response } from "express";
import { Types } from "mongoose";
import { TemplateModel, TaskModel, UserModel } from "../models";

class TemplateController {
  static async getByUser(req: Request, res: Response) {
    const { userId } = req.params;

    if (!Types.ObjectId.isValid(userId)) {
      return res.status(400).send("Invalid user id received");
    }

    try {
      const userFound = await UserModel.findById(userId).exec();
      if (!userFound) return res.status(400).send(`User with id ${userId} not found`);
      const templatesFound = await TemplateModel.find({ _id: { $in: userFound.templates } })
        .populate("tasks")
        .exec();
      return res.status(200).json({ template: templatesFound, count: templatesFound.length });
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
    const { userId } = req.params;
    const { title, description } = req.body;

    try {
      const userFound = await UserModel.findById(userId).exec();
      if (!userFound) return res.status(201).json("User with id not found");
      const templateCreated = await TemplateModel.create({
        _id: new Types.ObjectId(),
        title,
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
    const { title, description } = req.body;

    try {
      const result = await TemplateModel.findByIdAndUpdate(
        templateId,
        { title, description },
        { new: true },
      ).exec();
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

      await TaskModel.remove({ _id: { $in: templateFound.tasks } }).exec();
      await UserModel.findOneAndUpdate(
        { templates: templateFound._id },
        { $pull: { templates: templateFound._id } },
      ).exec();
      const result = await TemplateModel.deleteOne({ _id: templateId }).exec();

      return res.status(200).json({ template: result });
    } catch (error) {
      return res.status(500).json({ message: error.message, error });
    }
  }
}

export default TemplateController;
