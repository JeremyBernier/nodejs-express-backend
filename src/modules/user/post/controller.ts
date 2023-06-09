import type { Request, Response } from "express";
import type { UserJwt } from "../../../auth/UserJwt";
import UserPostService from "./service";

export const getMany = async (
  req: Request & { user: UserJwt },
  res: Response
) => {
  if (req.params.userId !== req.user.userId) {
    return res.status(401).send("Unauthorized");
  }
  try {
    const dbRes = await UserPostService.getMany(req.user.userId);
    return res.status(200).send({ data: dbRes });
  } catch (err) {
    console.error(err);
    return res.status(500).send();
  }
};

export const getSingle = async (
  req: Request & { user: UserJwt },
  res: Response
) => {
  if (req.params.userId !== req.user.userId) {
    return res.status(401).send("Unauthorized");
  }
  const { postId } = req.params;
  try {
    const dbRes = await UserPostService.getSingle(postId, req.user.userId);
    return res.status(200).send({ data: dbRes });
  } catch (err) {
    console.error(err);
    return res.status(500).send();
  }
};

export default { getSingle, getMany };
