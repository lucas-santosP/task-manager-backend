import mongoose, { Schema } from "mongoose";
import { ITask } from "../interfaces";

const TaskSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    status: {
      type: String,
      trim: true,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<ITask>("Task", TaskSchema);
