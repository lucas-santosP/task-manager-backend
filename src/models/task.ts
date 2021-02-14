import mongoose, { Schema } from "mongoose";
import { ITask } from "../interfaces";

const TaskSchema = new Schema(
  {
    text: {
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
