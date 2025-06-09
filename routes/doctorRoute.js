import express from "express";
import { findDocById, findDocBySpeciality, getAllDoctors, getUsersWithAppointments, login } from "../controllers/doctorController.js";
import { allowedTo, protect } from "../middlewares/auth-middleware.js";
import patientModel from "../models/patientModel.js";

const doctorRouter = express.Router();

doctorRouter.post("/login", login);
doctorRouter.get("/list", getAllDoctors);
// doctorRouter.get("/get-pieplot",protect , allowedTo("doctor") , sendDoctorPatientStats)
doctorRouter.get("/get-patients" , protect(patientModel) , allowedTo("doctor") , getUsersWithAppointments);
doctorRouter.get("/find-doc-by-id" , protect(patientModel) , findDocById);

doctorRouter.get("/find-doc-by-speciality" , protect(patientModel) , findDocBySpeciality);

export default doctorRouter;
