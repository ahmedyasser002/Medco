import express from "express";
import {
  addTest,
  completeTest,
  getTestsByPatientId,
  getTestsByDoctorId,
  getTestsByLaboratoryId,
} from "../controllers/testController.js";

import { protect, allowedTo } from "../middlewares/auth-middleware.js";

const testRouter = express.Router();

// Create new test
testRouter.post("/add", protect(), allowedTo("doctor",), addTest);

// Mark test as complete
testRouter.post("/complete", protect(), allowedTo("laboratory"), completeTest);

// Get tests by patient ID
testRouter.get("/patient/:patientId", protect(), allowedTo("doctor", "admin"), getTestsByPatientId);

// Get tests by doctor ID
testRouter.get("/doctor/:doctorId", protect(), allowedTo("doctor", "admin"), getTestsByDoctorId);

// Get tests by laboratory ID
testRouter.get("/laboratory/:laboratoryId", protect(), allowedTo("laboratory", "admin"), getTestsByLaboratoryId);

export default testRouter;
