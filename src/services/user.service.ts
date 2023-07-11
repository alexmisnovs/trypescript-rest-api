import {} from "mongoose";
import UserModel, { IUserInput } from "../models/user.model";

export async function createUser(input: IUserInput) {
  try {
    return await UserModel.create(input);
  } catch (e: any) {
    throw new Error(e);
  }
}
