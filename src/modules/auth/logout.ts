import type { Request, Response } from "../../types/express";
import { AUTH_COOKIE_NAME } from "../../constants";

export default function logout(req: Request, res: Response) {
  res.clearCookie(AUTH_COOKIE_NAME, { httpOnly: true, signed: true });
  res.clearCookie("connect.sid", { httpOnly: true, signed: true });
  // req.session.destroy();
  res.status(200).send();
}
