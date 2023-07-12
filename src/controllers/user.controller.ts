import { Request, Response } from "express";
import logger from "../utils/logger";
import { omit } from "lodash";
import { createUser } from "../services/user.service";
import { createUserInput } from "../schemas/user.schema";

export async function createUserHandler(
  req: Request<{}, {}, createUserInput["body"]>,
  res: Response
) {
  try {
    const user = await createUser(req.body); // call create user service
    return res.send(user);
  } catch (error: any) {
    logger.error(error);
    return res.status(409).send(error.message);
  }
}
