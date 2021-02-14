import { Request, Response } from "express";
import { Types } from "mongoose";
import TemplateModel from "../models/template";

class TemplateController {
  static async getAll(req: Request, res: Response) {
    try {
      const result = await TemplateModel.find().exec();
      return res.status(200).json({
        task: result,
        count: result.length,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
        error,
      });
    }
  }

  static async create(req: Request, res: Response) {
    const { title, description } = req.body;

    const template = new TemplateModel({
      _id: new Types.ObjectId(),
      title,
      description,
    });

    try {
      const result = await template.save();
      return res.status(201).json({ template: result });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
        error,
      });
    }
  }

  // static get(id:number){},
  // static update(id:number,task:TaskModel){}
  // static delete(id:number ){}
}

export default TemplateController;
