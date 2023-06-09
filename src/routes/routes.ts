import type { Request, Response } from "express";
import express from "express";
import loginRequired from "../auth/restrict";
import postRoutes from "../modules/post/routes";
import userRoutes from "../modules/user/routes";
import AuthController from "../modules/auth";

const v1 = express.Router();
v1.use(express.json());

v1.post("/login", AuthController.login);
v1.get("/logout", AuthController.logout);
v1.post("/signup", AuthController.signup);
// v1.post("/forgot_password", AuthController.forgotPassword);

v1.get("/profile", loginRequired, AuthController.getProfile);
// v1.post("/profile", restrict, AuthController.updateProfile);

v1.use("/posts", postRoutes);
v1.use("/users", userRoutes);

v1.get("/test", (req: Request, res: Response) => res.status(200).send("test"));

export default v1;
