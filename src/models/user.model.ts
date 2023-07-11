import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "config";

export interface IUserInput {
  email: string;
  name: string;
  password: string;
}

export interface IUser extends IUserInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
  comparePassword(providedPassword: string): Promise<boolean>;
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

  const salt = await bcrypt.genSalt(config.get<number>("saltWorkFactor"));
  const hash = await bcrypt.hashSync(user.password, salt);

  user.password = hash;

  return next();
});

userSchema.methods.comparePassword = async function (providedPassword: string): Promise<boolean> {
  const user = this as IUser;

  return bcrypt.compare(providedPassword, user.password).catch(e => false);
};

const UserModel = mongoose.model<IUser>("User", userSchema);

export default UserModel;
