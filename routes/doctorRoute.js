import express from "express";
import { getAllDoctors, login, sendDoctorPatientStats } from "../controllers/doctorController.js";
import { allowedTo, protect } from "../middlewares/auth-middleware.js";

const doctorRouter = express.Router();

doctorRouter.post("/login", login);
doctorRouter.get("/list", getAllDoctors);
doctorRouter.get("/get-pieplot",protect , allowedTo("doctor") , sendDoctorPatientStats)

export default doctorRouter;
