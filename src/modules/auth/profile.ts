import type { Request, Response } from "express";
import type { UserJwt } from "../../auth/UserJwt";
import omit from "lodash/omit";
import UserService from "../user/service";

export const getProfile = async (
  req: Request & { user: UserJwt },
  res: Response
) => {
  try {
    const dbRes = await UserService.getUser({
      id: req.user.userId,
    });

    const json = omit({ ...dbRes, ...req.user }, ["password"]);

    res.status(200).send(json);
  } catch (err) {
    console.error(err);
    res.status(401).send();
  }
  // update profile
};

export const updateProfile = async (
  req: Request & { user: UserJwt },
  res: Response
) => {
  if ("email" in req.body) {
    return res
      .status(400)
      .send("Cannot update email yet (will be possible in future)");
  }
  try {
    const dbRes = await UserService.updateUser({
      id: req.user.userId,
      ...req.body,
      // ...omitBy(req.body, val => val != null && val !== ''),
    });
    res.status(200).send();
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
  // update profile
};

export default {
  getProfile,
  updateProfile,
};
