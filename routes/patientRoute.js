import express from "express";
import {
  registerPatient,
  loginPatient,
  getProfile,
  updateProfile,
  getPatientList,
  getPatientEthereumAddressByNationalId
  // bookAppointment,
  // listAppointmentByPatientId,
  // cancelAppointment,
} from "../controllers/patientController.js";

import { protect, allowedTo } from "../middlewares/auth-middleware.js";

import authAdmin from "../middlewares/authAdmin.js";
import patientModel from "../models/patientModel.js";
import upload from "../middlewares/uploadMiddleware.js";


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

patientRouter.get("/get-ethereum-address", protect(), allowedTo("doctor"), getPatientEthereumAddressByNationalId);


patientRouter.patch('/update-profile',protect(patientModel), upload.single('image'), updateProfile);


// patientRouter.post("/book-appointment", protect, bookAppointment);
// patientRouter.get("/list-appointments", protect, listAppointmentByPatientId);
// patientRouter.post("/cancel-appointment", protect, cancelAppointment);

export default patientRouter;
