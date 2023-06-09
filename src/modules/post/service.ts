import Post from "../../entity/Post.entity";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { AppDataSource } from "../../data-source";

export const getMany = async () => {
  const res = await AppDataSource.getRepository(Post)
    .createQueryBuilder("post")
    .getMany();

  return res;
};

export const create = async (input) => {
  const inputObj = plainToClass(Post, input);
  const errors = await validate(inputObj);
  if (errors?.length) {
    throw new Error(String(errors));
  }

  const repo = AppDataSource.getRepository(Post);
  return repo.save(inputObj);
};

export const getSingle = async (postId: string) => {
  const res = await AppDataSource.getRepository(Post)
    .createQueryBuilder("post")
    .where("post.id = :postId", { postId })
    .getOne();

  return res;
};

// export const updateUserCourse = async (input: {
//   userId: string;
//   courseId: string;
//   completed: boolean;
// }) => {
//   const inputObj = plainToClass(UserCourse, input);

//   const errors = await validate(inputObj);
//   if (errors?.length) {
//     throw new Error(String(errors));
//   }

//   const repo = AppDataSource.getRepository(UserCourse);
//   return repo.save(inputObj);
// };

export default {
  // updateSingle: updateUserCourse,
  getSingle,
  create,
  getMany,
};
