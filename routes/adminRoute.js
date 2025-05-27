import express from "express";

import {
  addDoctor,
  deleteDoctor,
  deletePatient,
  getAppointmentList,
  loginAdmin,
} from "../controllers/adminController.js";

import upload from "../middlewares/multer.js";

import authAdmin from "../middlewares/authAdmin.js";
import { allowedTo, protect } from "../middlewares/auth-middleware.js";

const adminRouter = express.Router();

// adminRouter.post("/login", loginAdmin);

adminRouter.post(
  "/add-doctor",
  protect,
  allowedTo("admin"),
  upload.single("image"),
  addDoctor
);

adminRouter.delete("/delete-doctor", protect, allowedTo("admin"), deleteDoctor);

adminRouter.delete(
  "/delete-patient",
  protect,
  allowedTo("admin"),
  deletePatient
);

adminRouter.get(
  "/get-appointments",
  protect,
  allowedTo("admin"),
  getAppointmentList
);
export default adminRouter;
