import mongoose, { Schema } from "mongoose";
import { IUser } from "../interfaces";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    templates: [
      {
        type: Schema.Types.ObjectId,
        ref: "Template",
      },
    ],
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IUser>("User", UserSchema);
