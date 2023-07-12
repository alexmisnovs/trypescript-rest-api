import { FilterQuery, UpdateQuery } from "mongoose";
import sessionModel, { ISession } from "../models/session.model";
import { findUser } from "./user.service";
import { get } from "lodash";
import { verifyJWT, signJWT } from "../utils/jwt";
import config from "config";

export async function createSession(userId: String, userAgent: String) {
  const session = await sessionModel.create({
    user: userId,
    userAgent,
  });

  return session.toJSON();
}

export async function getSessions(query: FilterQuery<ISession>) {
  return await sessionModel.find(query).lean();
}

export async function updateSession(query: FilterQuery<ISession>, update: UpdateQuery<ISession>) {
  return await sessionModel.updateOne(query, update);
}
export async function reIssueAccessToken({ refreshToken }: { refreshToken: string }) {
  const { decoded } = verifyJWT(refreshToken);

  if (!decoded || !get(decoded, "session")) return false;

  const session = await sessionModel.findById(get(decoded, "session"));

  if (!session || !session.valid) return false;

  const user = await findUser({ _id: session.user });

  if (!user) return false;

  const accessToken = signJWT(
    {
      ...user,
      session: session._id,
    },
    { expiresIn: config.get<string>("accessTokenTTL") } // 15min
  );
  return accessToken;
}
