import mongoose, { Schema } from "mongoose";
import { ITemplate } from "../interfaces";

const TemplateSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<ITemplate>("Template", TemplateSchema);
