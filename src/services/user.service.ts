import { FilterQuery } from "mongoose";
import userModel, { IUser, IUserInput } from "../models/user.model";
import { omit } from "lodash";

export async function createUser(input: IUserInput) {
  try {
    const user = await userModel.create(input);
    return omit(user.toJSON(), "password");
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function validatePassword({ email, password }: { email: string; password: string }) {
  const user = await userModel.findOne({ email });

  if (!user) return false;

  const isValid = await user.comparePassword(password);
  if (!isValid) return false;

  return omit(user.toJSON(), "password");
}

export async function findUser(query: FilterQuery<IUser>) {
  return userModel.findOne(query).lean();
}
