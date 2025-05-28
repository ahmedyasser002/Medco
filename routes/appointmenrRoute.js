import express from "express";
import {
  bookAppointment,
  listAppointmentByDoctorId,
  listAppointmentByPatientId,
} from "../controllers/appointmentController.js";
import { allowedTo, protect } from "../middlewares/auth-middleware.js";

const appointmentRouter = express.Router();

appointmentRouter.get("/doctor", protect(), allowedTo('doctor'), listAppointmentByDoctorId);
appointmentRouter.get("/patient", protect(), listAppointmentByPatientId);
appointmentRouter.post("/book",bookAppointment)

export default appointmentRouter;
