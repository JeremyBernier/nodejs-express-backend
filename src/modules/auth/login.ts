import type { NextFunction, Request, Response } from "express";
import type { UserJwt } from "../../auth/UserJwt";
import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import omit from "lodash/omit";
import { getUser, updateUser } from "../user/service";
import { AUTH_COOKIE_NAME } from "../../constants";
import { transporter } from "../mail";

const loginHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body as any;
  try {
    const user = await getUser({ email });

    if (!user || user.password == null) {
      throw new Error("Username or password is incorrect");
    }

    const userObj: UserJwt = {
      userId: user.id,
      email: user.email,
    };

    // We're allowing passwordless email signups so this is possible
    if (user.password == null || user.password === "") {
      if (user.email == null || user.email === "") {
        // if we're here we screwed up
        throw new Error(`User has no email or password`);
      }

      return res
        .status(500)
        .send({ error: "Sorry, passwordless login is not enabled yet" });

      // const tempPasswordToken = jwt.sign(
      //   userObj,
      //   process.env.EXPRESS_SESSION_SECRET,
      //   {
      //     expiresIn: "2d",
      //   }
      // );
      // await updateUser({
      //   id: user.id,
      //   tempPasswordToken,
      // });
      // // save tempPasswordToken to database
      // const loginUrl = `${process.env.API_URL}/login?token=${tempPasswordToken}`;
      // // send email to user
      // transporter.sendMail({
      //   from: process.env.EMAIL,
      //   to: user.email,
      //   subject: "DPlusArena Login Link",
      //   //         text: `Hey it's Jeremy,

      //   // Click the following like to confirm your email subscription and start receiving updates straight to your inbox: ${token}

      //   // Link expires in 2 days. Of course your email will never be shared with anyone, and you can cancel anytime.`,
      //   html: `<p>Click the following link to log in to DPlusArena: <a href="${loginUrl}">DPlusArena Login Link</a></p>
      //   <p>Link expires in 2 days</p>`,
      // });
    }

    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid) {
      throw new Error("Username or password is incorrect");
    }

    const token = jwt.sign(userObj, process.env.EXPRESS_SESSION_SECRET, {
      expiresIn: "7d",
    });

    // TODO: consolidate with code in signup
    res.cookie(AUTH_COOKIE_NAME, token, {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      // sameSite: "strict",
      httpOnly: true, // The cookie only accessible by the web server
      signed: true,
    });

    return res.status(200).json({
      success: true,
      data: omit(user, ["password"]),
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      success: false,
      error: String(err),
    });
  }
};

export default loginHandler;
