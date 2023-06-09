import type { Request, Response, NextFunction } from "express";
import { GlobalRole } from "../types/GlobalRole";
import jwt from "jsonwebtoken";
import { AUTH_COOKIE_NAME } from "../constants";
import UserService from "../modules/user/service";
import { UserJwt } from "./UserJwt";

interface ErrorObj {
  status?: number;
  message?: string;
}

export const signJwtToken = (
  json: any,
  secret: string,
  opts: { expiresIn: string }
) => jwt.sign(json, secret, opts);

export const verifyJwtToken = (token, secret): Promise<[Error, any]> =>
  new Promise((resolve) =>
    jwt.verify(token, secret, (err, decoded) => resolve([err, decoded]))
  );

export const authorize = async (req): Promise<ErrorObj | null> => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return {
      status: 401,
    };
  }
  const [err, decoded] = await verifyJwtToken(
    token,
    process.env.EXPRESS_SESSION_SECRET as string
  );
  return null;
};

export const getUserToken = (
  req: Request,
  res: Response,
  next?: NextFunction
) => {
  // We grab the token from the cookies
  const token = req.signedCookies[AUTH_COOKIE_NAME];
  // jwt verify throws an exception when the token isn't valid
  try {
    const userObj = jwt.verify(token, process.env.EXPRESS_SESSION_SECRET);
    // @ts-ignore
    req.user = userObj as UserJwt;
  } catch (error) {}
  next?.();
};

export default async function loginRequired(
  req: Request,
  res: Response,
  next: NextFunction
) {
  getUserToken(req, res);

  if (!("user" in req)) {
    res.status(401).send({
      loggedIn: false,
      message: "Unauthorized",
    });
    return;
  }
  next();
}

export function isUserMod(role: number): boolean {
  return role === GlobalRole.SuperAdmin;
}

export async function adminOnly(
  req: Request & { user?: UserJwt },
  res: Response,
  next: NextFunction
) {
  getUserToken(req, res);

  if (!("user" in req)) {
    return res.status(401).send({
      loggedIn: false,
      message: "Unauthorized",
    });
  }

  const userDb = await UserService.getUser({ id: req.user.userId });
  if (!isUserMod(userDb.role)) {
    return res.status(401).send({
      loggedIn: false,
      message: "Unauthorized",
    });
  }

  next();
}

// export default async function restrict(req, res, next) {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];

//   if (token == null) {
//     return res.sendStatus(401);
//   }

//   jwt.verify(
//     token,
//     process.env.EXPRESS_SESSION_SECRET as string,
//     (err: any, user: any) => {
//       console.log(err);

//       if (err) {
//         return res.sendStatus(403);
//       }

//       req.user = user;

//       next();
//     }
//   );
// }
