import Post from "../../../entity/Post.entity";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { AppDataSource } from "../../../data-source";

// export const upsert = async (input) => {
//   const inputObj = plainToClass(UserPost, input);
//   const errors = await validate(inputObj);
//   if (errors?.length) {
//     throw new Error(String(errors));
//   }

//   const repo = AppDataSource.getRepository(UserPost);
//   return repo.upsert([inputObj], ["userId", "postId"]);
// };

export const getMany = async (userId: string) => {
  const res = await AppDataSource.getRepository(Post)
    .createQueryBuilder("post")
    .select(["post"])
    .leftJoinAndSelect("post.userPost", "uc", "uc.userId = :userId", {
      userId,
    })
    .getMany();

  return res;
};

export const getSingle = async (postId: string, userId: string) => {
  const res = await AppDataSource.getRepository(Post)
    .createQueryBuilder("post")
    .select(["post"])
    .leftJoinAndSelect("post.userPost", "uc", "uc.userId = :userId", {
      userId,
    })
    .where("post.id = :postId", { postId })
    .getOne();

  return res;
};

export default {
  // upsert,
  getSingle,
  getMany,
};
