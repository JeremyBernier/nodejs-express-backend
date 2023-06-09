import express from "express";
import UserPostController from "./post/controller";
import loginRequired from "../../auth/restrict";

const router = express.Router();
router.use(express.json());

router.get("/:userId/posts", loginRequired, UserPostController.getMany);

router.get(
  "/:userId/posts/:postId",
  loginRequired,
  UserPostController.getSingle
);

export default router;
