import express from "express";
import {
  registerPatient,
  loginPatient,
  getProfile,
  updateProfile,
  getPatientList,
  // bookAppointment,
  // listAppointmentByPatientId,
  // cancelAppointment,
} from "../controllers/patientController.js";

import { protect, allowedTo } from "../middlewares/auth-middleware.js";
import upload from "../middlewares/multer.js";

import authAdmin from "../middlewares/authAdmin.js";
import patientModel from "../models/patientModel.js";


const patientRouter = express.Router();

patientRouter.post("/register", registerPatient);
patientRouter.post("/login", loginPatient);

patientRouter.get("/get-profile", protect(patientModel), getProfile);

// patientRouter.post(
//   "/update-profile",
//   protect,
//   upload.single("image"),
//   updateProfile
// );

patientRouter.get("/list", protect(), allowedTo("admin"), getPatientList);
patientRouter.patch('/update-profile',protect(patientModel), upload.single('image'), updateProfile);


// patientRouter.post("/book-appointment", protect, bookAppointment);
// patientRouter.get("/list-appointments", protect, listAppointmentByPatientId);
// patientRouter.post("/cancel-appointment", protect, cancelAppointment);

export default patientRouter;
