import type { Request, Response } from "express";
import type { UserJwt } from "../../auth/UserJwt";
import PostService from "./service";

export const create = async (
  req: Request & { user: UserJwt },
  res: Response
) => {
  const dbRes = await PostService.create(req.body);
  return res.status(200).send({ data: dbRes });
};

export const getMany = async (
  // req: Request & { user: UserJwt },
  req: Request,
  res: Response
) => {
  // if (req.params.userId !== req.user.userId) {
  //   return res.status(401).send("Unauthorized");
  // }
  try {
    const posts = await PostService.getMany();
    return res.status(200).send({ data: posts });
  } catch (err) {
    console.error(err);
    return res.status(500).send();
  }
};

export const getSingle = async (
  req: Request & { user: UserJwt },
  res: Response
) => {
  const { postId } = req.params;
  try {
    const post = await PostService.getSingle(postId);
    return res.status(200).send({ data: post });
  } catch (err) {
    console.error(err);
    return res.status(500).send();
  }
};

// export const updateSingle = async (
//   req: Request & { user: UserJwt },
//   res: Response
// ) => {
//   if (req.params.userId !== req.user.userId) {
//     return res.status(401).send("Unauthorized");
//   }
//   const userId = req.user.userId;
//   const courseId = req.params.courseId;
//   const userIdToUpdate = req.params.userId;
//   const completed = req.body.completed;
//   if (
//     userId == null ||
//     courseId == null ||
//     userIdToUpdate == null ||
//     completed == null
//   ) {
//     return res.status(400).send(`Invalid input`);
//   }

//   if (userId !== userIdToUpdate) {
//     return res.status(401).send(`Cannot update another user's course status`);
//   }

//   try {
//     const course = await PostService.updateSingle({
//       userId,
//       courseId,
//       completed: completed && completed !== "false",
//     });
//     return res.status(200).send({ data: course });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).send();
//   }
// };

export default {
  getSingle,
  getMany,
  // updateSingle,
  create,
};
