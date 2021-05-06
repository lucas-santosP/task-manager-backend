import { Types } from "mongoose";
import { TaskModel, TemplateModel } from "../models";
import { ITask, IUser } from "../interfaces";

class CreateInitialTemplates {
  async create(user: IUser) {
    const tasks: Pick<ITask, "name" | "status">[] = [
      { name: "Learn about Tailwind CSS", status: "to do" },
      { name: "Search about CSS Grid", status: "doing" },
      { name: "Finish frontend test", status: "doing" },
      { name: "Learn more about flexbox", status: "done" },
      { name: "Search javascript reducer array method", status: "done" },
    ];

    const tasksId: string[] = [];
    for (const task of tasks) {
      const taskCreated = await TaskModel.create({
        _id: new Types.ObjectId(),
        ...task,
      });
      tasksId.push(taskCreated._id);
    }

    const studiesTemplate = await TemplateModel.create({
      _id: new Types.ObjectId(),
      tasks: tasksId,
      name: "Studies",
      description: "Initial template, feel free to delete it.",
    });

    user.templates.push(studiesTemplate._id);
    await user.save();
  }
}

export default new CreateInitialTemplates();
