import type {
  Request as RequestExpress,
  Response as ResponseExpress,
} from "express";

interface User {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export interface Request extends RequestExpress {
  user: User;
}

export type Response = ResponseExpress;
