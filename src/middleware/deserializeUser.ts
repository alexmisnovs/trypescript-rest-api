import { get } from "lodash";
import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../utils/jwt";
import { reIssueAccessToken } from "../services/session.service";

const deserealizedUser = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = get(req, "headers.authorization", "").replace(/^Bearer\s/, "");
  // const refreshToken = <string>get(req, "headers.x-refresh");
  const refreshToken = get(req, "headers.x-refresh") as string;

  if (!accessToken) {
    return next();
  }

  const { decoded, expired } = verifyJWT(accessToken);

  if (decoded) {
    res.locals.user = decoded;
    return next();
  }

  if (expired && refreshToken) {
    const refreshedAccessToken = await reIssueAccessToken({ refreshToken });
    if (refreshedAccessToken) {
      res.setHeader("x-access-token", refreshedAccessToken);

      const result = verifyJWT(refreshedAccessToken);

      res.locals.user = result.decoded;
      return next();
    }
  }

  return next();
};

export default deserealizedUser;
