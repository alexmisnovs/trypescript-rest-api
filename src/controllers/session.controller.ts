import { Request, Response } from "express";
import { validatePassword } from "../services/user.service";
import { createSession, getSessions, updateSession } from "../services/session.service";
import { signJWT } from "../utils/jwt";
import config from "config";

export async function createUserSessionHanlder(req: Request, res: Response) {
  // validate users password
  const user = await validatePassword(req.body);
  if (!user) return res.status(401).send("Invalid email or password");

  // create a session
  const session = await createSession(user._id, req.get("user-agent") || "");
  // create access token
  const accessToken = signJWT(
    {
      ...user,
      session: session._id,
    },
    { expiresIn: config.get<string>("accessTokenTTL") } // 15min
  );
  // create a refresh token
  const refreshToken = signJWT(
    {
      ...user,
      session: session._id,
    },
    { expiresIn: config.get<string>("refreshTokenTTL") } // 15min
  );

  // return access & refresh token
  return res.send({ accessToken, refreshToken });
}
export async function getUserSessionsHandler(req: Request, res: Response) {
  const userId = res.locals.user._id;
  const sessions = await getSessions({ user: userId, valid: true });
  return res.send(sessions);
}
export async function deleteUserSessionHandler(req: Request, res: Response) {
  const sessionId = res.locals.user.session;
  await updateSession({ _id: sessionId }, { valid: false });

  return res.send({
    accessToken: null,
    refreshToken: null,
  });
}
