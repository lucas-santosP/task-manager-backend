import { Document } from "mongoose";

export interface ITask extends Document {
  title: String;
  description: String;
  status: "to do" | "doing" | "done";
}

export interface ITemplate extends Document {
  title: String;
  description: String;
  tasks: String[] | ITask[];
}

export interface IUser extends Document {
  email: String;
  name: String;
  password: String;
  templates: String[] | ITemplate[];
}
