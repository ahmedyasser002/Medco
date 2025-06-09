import express from "express";
import {
  bookAppointment,
  listAppointmentByDoctorId,
  listAppointmentByPatientId,
} from "../controllers/appointmentController.js";
import { allowedTo, protect } from "../middlewares/auth-middleware.js";
import patientModel from "../models/patientModel.js";
import appointmentModel from "../models/appointmentModel.js";

const appointmentRouter = express.Router();

appointmentRouter.get("/doctor", protect(), allowedTo('doctor'), listAppointmentByDoctorId);
appointmentRouter.get("/patient", protect(patientModel), listAppointmentByPatientId);
appointmentRouter.post("/book",bookAppointment)
appointmentRouter.post("/cancel" , cancelAppointment);

export default appointmentRouter;
