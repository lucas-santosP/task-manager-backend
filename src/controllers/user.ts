import { Request, Response } from "express";
import { Types } from "mongoose";
import { TemplateModel, TaskModel, UserModel } from "../models";

class UserController {
  static async getAll(req: Request, res: Response) {
    try {
      const usersFound = await UserModel.find().select("_id name email").exec();
      return res.status(200).json({ user: usersFound, count: usersFound.length });
    } catch (error) {
      return res.status(500).json({ message: error.message, error });
    }
  }

  static async create(req: Request, res: Response) {
    const { email, name, password } = req.body;

    try {
      const userCreated = await UserModel.create({
        _id: new Types.ObjectId(),
        email,
        name,
        password,
      });
      const result = { _id: userCreated._id, name: userCreated.name, email: userCreated.email };

      return res.status(200).json({ user: result });
    } catch (error) {
      return res.status(500).json({ message: error.message, error });
    }
  }

  static async update(req: Request, res: Response) {
    const { userId } = req.params;
    const { email, name, password } = req.body;

    if (!Types.ObjectId.isValid(userId)) {
      return res.status(400).send("Invalid user id received");
    }
    //encrypt password

    try {
      const userUpdated = await UserModel.findByIdAndUpdate(
        userId,
        { email, name, password },
        { new: true },
      )
        .select("_id name email")
        .exec();

      return res.status(200).json({ user: userUpdated });
    } catch (error) {
      return res.status(500).json({ message: error.message, error });
    }
  }

  static async delete(req: Request, res: Response) {
    const { userId } = req.params;

    if (!Types.ObjectId.isValid(userId)) {
      return res.status(400).send("Invalid task id received");
    }

    try {
      const userFound = await UserModel.findById(userId).exec();
      if (!userFound) return res.status(400).send(`User with id ${userId} not found`);

      const userTemplates = await TemplateModel.find({ _id: { $in: userFound.templates } }).exec();
      for (const template of userTemplates) {
        await TaskModel.remove({ _id: { $in: template.tasks } }).exec();
      }
      await TemplateModel.remove({ _id: { $in: userFound.templates } }).exec();
      const result = await UserModel.deleteOne({ _id: userId }).exec();

      return res.status(200).json({ user: result });
    } catch (error) {
      return res.status(500).json({ message: error.message, error });
    }
  }
}

export default UserController;
