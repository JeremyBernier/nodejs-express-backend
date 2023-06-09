import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { AppDataSource } from "../../data-source";
import User from "../../entity/User.entity";

const fields = new Set(Object.keys(new User()));

export const getUsers = async () => {
  const userRepository = await AppDataSource.getRepository(User);
  return userRepository.find();
};

export const getUser = async (params: { id?: string; email?: string }) => {
  const userRepository = await AppDataSource.getRepository(User);
  return userRepository.findOne({
    where: {
      ...params,
    },
  });
};

export const createUser = async (input) => {
  for (const key in input) {
    if (!fields.has(key)) {
      throw new Error(`${key} is not a valid property`);
    }
  }

  const inputObj = plainToClass(User, input);

  const errors = await validate(inputObj);
  if (errors?.length) {
    throw new Error(String(errors));
  }

  const userRepository = await AppDataSource.getRepository(User);
  return userRepository.save(inputObj);
};

export const updateUser = async (input) => {
  for (const key in input) {
    if (!fields.has(key)) {
      throw new Error(`${key} is not a valid property`);
    }
  }

  if ("email" in input) {
    throw new Error(
      "Cannot update email at the moment (will be possible in the future)"
    );
  }

  const inputObj = plainToClass(User, input);

  // validates every single field so ignoring for now
  // const errors = await validate(inputObj);
  // if (errors?.length) {
  //   throw new Error(String(errors));
  // }

  const whereArr: [string, any] = input.id
    ? ["id = :id", { id: input.id }]
    : ["email = :email", { email: input.email }];

  return AppDataSource.createQueryBuilder()
    .update(User)
    .set({ ...input })
    .where(...whereArr)
    .execute();
  // const userRepository = await AppDataSource.getRepository(User);
  // return userRepository.save(inputObj);
};

export const deleteUser = async (input: { id: string }) => {
  const userRepository = await AppDataSource.getRepository(User);
  return userRepository.delete(input.id);
};

export default {
  getUser,
  getUsers,
  updateUser,
  deleteUser,
};
