import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  getPatientList,
  bookAppointment,
  listAppointmentByPatientId,
  cancelAppointment,
} from "../controllers/patientController.js";

import { protect, allowedTo } from "../middlewares/auth-middleware.js";
import upload from "../middlewares/multer.js";

import authAdmin from "../middlewares/authAdmin.js";


const patientRouter = express.Router();

patientRouter.post("/register", registerUser);
patientRouter.post("/login", loginUser);

patientRouter.get("/get-profile", protect, getProfile);

patientRouter.post(
  "/update-profile",
  protect,
  upload.single("image"),
  updateProfile
);

patientRouter.get("/list", protect, allowedTo("admin"), getPatientList);

patientRouter.post("/book-appointment", protect, bookAppointment);
patientRouter.get("/list-appointments", protect, listAppointmentByPatientId);
patientRouter.post("/cancel-appointment", protect, cancelAppointment);

export default patientRouter;
