import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "config";

export interface HookNextFunction {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (error?: Error): any;
}

export interface IUser extends mongoose.Document {
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  let user = this as IUser;

  if (!user.isModified("password")) return next();

  const salt = await bcrypt.genSalt(config.get<number>("saltWorkNumber"));
  const hash = await bcrypt.hashSync(user.password, salt);

  user.password = hash;

  return next();
});

const UserModel = mongoose.model<IUser>("User", userSchema);

export default UserModel;
