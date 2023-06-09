import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import omit from "lodash/omit";
import { createUser, getUser } from "../user/service";
// import { signJwtToken } from "../../auth/restrict";
import { AUTH_COOKIE_NAME } from "../../constants";

// const validateSignupParams(params) {

// }

const signup = async (req: Request, res: Response) => {
  // const error = validateSignupParams(req.body);

  const existingUser = await getUser({ email: req.body.email });
  if (existingUser) {
    return res.status(400).send({ error: "User already registered" });
  }

  const user = await createUser(req.body);

  //   if (newUser.email) {
  //     const token = signJwtToken(
  //       { email: newUser.email },
  //       process.env.EXPRESS_SESSION_SECRET,
  //       { expiresIn: "2d" }
  //     );
  //     const verifyUrl = `${process.env.API_URL}/users/verify_email/?token=${token}`;
  //     transporter.sendMail({
  //       from: process.env.EMAIL,
  //       to: newUser.email,
  //       subject: "Confirm Jeremy Bernier Newsletter Subscription",
  //       //         text: `Hey it's Jeremy,

  //       // Click the following like to confirm your email subscription and start receiving updates straight to your inbox: ${token}

  //       // Link expires in 2 days. Of course your email will never be shared with anyone, and you can cancel anytime.`,
  //       html: `<p>Hey it's Jeremy,</p>
  // <p>Click the following like to confirm your email subscription and start receiving updates straight to your inbox: <a href="${verifyUrl}">Email Confirmation Link</a></p>
  // <p>Link expires in 2 days. Of course your email will never be shared with anyone, and you can cancel anytime.</p>`,
  //     });
  //   }

  const userObj = {
    userId: user.id,
    email: user.email,
  };

  const token = jwt.sign(userObj, process.env.EXPRESS_SESSION_SECRET, {
    expiresIn: "7d",
  });

  // TODO: consolidate with code in login
  res.cookie(AUTH_COOKIE_NAME, token, {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    // sameSite: "strict",
    httpOnly: true, // The cookie only accessible by the web server
    signed: true,
  });

  return res.status(200).send({
    success: true,
    data: omit(user, ["password"]),
  });

  //   const newUser = await createUser(req.body);

  //   if (newUser.email) {
  //     const token = signJwtToken(
  //       { email: newUser.email },
  //       process.env.EXPRESS_SESSION_SECRET,
  //       { expiresIn: "2d" }
  //     );
  //     const verifyUrl = `${process.env.API_URL}/users/verify_email/?token=${token}`;
  //     transporter.sendMail({
  //       from: process.env.EMAIL,
  //       to: newUser.email,
  //       subject: "Confirm Jeremy Bernier Newsletter Subscription",
  //       //         text: `Hey it's Jeremy,

  //       // Click the following like to confirm your email subscription and start receiving updates straight to your inbox: ${token}

  //       // Link expires in 2 days. Of course your email will never be shared with anyone, and you can cancel anytime.`,
  //       html: `<p>Hey it's Jeremy,</p>
  // <p>Click the following like to confirm your email subscription and start receiving updates straight to your inbox: <a href="${verifyUrl}">Email Confirmation Link</a></p>
  // <p>Link expires in 2 days. Of course your email will never be shared with anyone, and you can cancel anytime.</p>`,
  //     });
  //   }
  //   return res.status(200).send(newUser);
  // } catch (err) {
  //   return res.status(400).send(String(err));
  // }
};

export default signup;
