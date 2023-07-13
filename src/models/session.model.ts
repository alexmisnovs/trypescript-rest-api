import mongoose from "mongoose";
import { IUser } from "./user.model";

export interface ISessionInput {
  user: IUser["_id"];
  valid: boolean;
  userAgent: String;
}

export interface ISession extends ISessionInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    valid: {
      type: Boolean,
      default: true,
    },
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const sessionModel = mongoose.model<ISession>("Session", sessionSchema);

export default sessionModel;
