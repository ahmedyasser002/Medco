import express from "express";
import { getAllDoctors, login } from "../controllers/doctorController.js";

const doctorRouter = express.Router();

doctorRouter.post("/login", login);
doctorRouter.get("/list", getAllDoctors);

export default doctorRouter;
