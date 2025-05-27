import express from "express";
import {
  listAppointmentByDoctorId,
  listAppointmentByPatientId,
} from "../controllers/appointmentController.js";
import { allowedTo, protect } from "../middlewares/auth-middleware.js";

const appointmentRouter = express.Router();

appointmentRouter.get("/doctor", protect, allowedTo('doctor'), listAppointmentByDoctorId);
appointmentRouter.get("/patient", protect, listAppointmentByPatientId);

export default appointmentRouter;
