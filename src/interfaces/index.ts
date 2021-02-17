import { Document } from "mongoose";

export interface ITask extends Document {
  text: String;
}

export interface ITemplate extends Document {
  title: String;
  description: String;
  tasks: String[];
}

export interface IUser extends Document {
  email: String;
  name: String;
  password: String;
  templates: String[];
}
