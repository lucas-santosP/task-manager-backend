import { Request, Response } from "express";
import { Types } from "mongoose";
import UserModel from "../models/user";
import TemplateModel from "../models/template";
import TaskModel from "../models/task";

class TaskController {
  // static async getAll(req: Request, res: Response) {
  //   try {
  //     const task = await UserModel.find().exec();
  //     return res.status(200).json({ task: task, count: task.length });
  //   } catch (error) {
  //     return res.status(500).json({ message: error.message, error });
  //   }
  // }

  static async create(req: Request, res: Response) {
    const { email, name, password } = req.body;

    try {
      const userCreated = await UserModel.create({
        _id: new Types.ObjectId(),
        email,
        name,
        password,
      });
      return res.status(200).json({ user: userCreated });
    } catch (error) {
      return res.status(500).json({ message: error.message, error });
    }
  }

  static async update(req: Request, res: Response) {
    const { userId } = req.params;
    const { email, name, password } = req.body;

    if (!Types.ObjectId.isValid(userId)) {
      return res.status(400).send("Invalid task id received");
    }

    try {
      const userUpdated = await UserModel.findByIdAndUpdate(
        userId,
        { email, name, password },
        { new: true },
      ).exec();
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
      const userFound = await UserModel.findById(userId)
        .populate({
          path: "templates",
          model: "Template",
          populate: { path: "tasks", model: "Task" },
        })
        .exec();
      if (!userFound) return res.status(400).send(`User with id ${userId} not found`);

      for (const template of userFound.templates) {
        //prevent types overlap
        if ("title" in template) {
          for (const taskId of template.tasks) {
            await TaskModel.deleteOne({ _id: taskId }).exec();
          }
          await TemplateModel.deleteOne({ _id: template._id }).exec();
        }
      }
      const result = await userFound.delete();
      return res.status(200).json({ user: result });
    } catch (error) {
      return res.status(500).json({ message: error.message, error });
    }
  }
}

export default TaskController;
