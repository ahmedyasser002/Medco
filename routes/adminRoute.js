import express from "express";

import {
  addDoctor,
  deleteDoctor,
  deletePatient,
  getAppointmentCount,
  getTotalFees,
  getAppointmentList,
  loginAdmin,
  sendDataForBarPlot,
  sendDateForPiePlot,
} from "../controllers/adminController.js";


import authAdmin from "../middlewares/authAdmin.js";
import { allowedTo, protect } from "../middlewares/auth-middleware.js";
import upload from "../middlewares/uploadMiddleware.js";
import { getPatientCount } from "../controllers/patientController.js";

const adminRouter = express.Router();

// adminRouter.post("/login", loginAdmin);

adminRouter.post(
  "/add-doctor",
  protect(),
  allowedTo("admin"),
  upload.single("image"),
  addDoctor
);

adminRouter.delete("/delete-doctor", protect(), allowedTo("admin"), deleteDoctor);

adminRouter.delete(
  "/delete-patient",
  protect(),
  allowedTo("admin"),
  deletePatient
);

adminRouter.get(
  "/get-appointments",
  protect(),
  allowedTo("admin"),
  getAppointmentList
);

adminRouter.get(
  "/get-barplot",
  protect(),
  allowedTo("admin", "doctor"),
  sendDataForBarPlot
)

adminRouter.get(
  "/get-pieplot",
  protect(),
  allowedTo("admin", "doctor"),
  sendDateForPiePlot
),

adminRouter.get(
  "/appointment-count",
  protect(),
  allowedTo("admin"),
  getAppointmentCount
)
adminRouter.get(
  "/appointment-totalfees",
  protect(),
  allowedTo("admin"),
  getTotalFees
)

adminRouter.get(
  "patients-count",
  protect(),
  allowedTo("admin"),
  getPatientCount

);

export default adminRouter;
