import express from "express";
import v1 from "./routes";

const api = express.Router();
api.use(express.json());

api.use("/v1/", v1);

export default api;
