import express from "express";
import { getAllDoctors, getUsersWithAppointments, login } from "../controllers/doctorController.js";
import { allowedTo, protect } from "../middlewares/auth-middleware.js";

const doctorRouter = express.Router();

doctorRouter.post("/login", login);
doctorRouter.get("/list", getAllDoctors);
// doctorRouter.get("/get-pieplot",protect , allowedTo("doctor") , sendDoctorPatientStats)
doctorRouter.get("/get-patients" , protect , allowedTo("doctor") , getUsersWithAppointments);

export default doctorRouter;
