import express from "express";
import PostController from "./controller";
import { adminOnly } from "../../auth/restrict";

const router = express.Router();
router.use(express.json());

router.get("/", PostController.getMany);

router.post("/", adminOnly, PostController.create);

router.get("/:postId", PostController.getSingle);

// router.put(
//   "/:userId/courses/:courseId",
//   restrict,
//   UserCourseController.updateSingle
// );

export default router;
