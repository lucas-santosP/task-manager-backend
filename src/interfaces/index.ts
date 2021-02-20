import { Document } from "mongoose";

export interface ITask extends Document {
  title: string;
  description: string;
  status: "to do" | "doing" | "done";
}

export interface ITemplate extends Document {
  title: string;
  description: string;
  tasks: string[] | ITask[];
}

export interface IUser extends Document {
  email: string;
  name: string;
  password: string;
  templates: string[] | ITemplate[];
}
