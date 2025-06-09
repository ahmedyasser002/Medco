import express from "express";

import {
  addDoctor,
  deleteDoctor,
  deletePatient,
  getAppointmentList,
  loginAdmin,
  sendDataForBarPlot,
  sendDateForPiePlot,
} from "../controllers/adminController.js";


import authAdmin from "../middlewares/authAdmin.js";
import { allowedTo, protect } from "../middlewares/auth-middleware.js";
import upload from "../middlewares/uploadMiddleware.js";

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
  allowedTo("admin"),
  sendDataForBarPlot
)

adminRouter.get(
  "/get-pieplot",
  protect(),
  allowedTo("admin"),
  sendDateForPiePlot
)
export default adminRouter;
