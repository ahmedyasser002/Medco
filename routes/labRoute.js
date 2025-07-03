import express from "express";
import { allowedTo, protect } from "../middlewares/auth-middleware.js";

const labRouter = express.Router();

// labRouter.post("/login", login);
// l.get("/list", getAllDoctors);
// doctorRouter.get("/get-pieplot",protect , allowedTo("doctor") , sendDoctorPatientStats)
labRouter.get("/get-lab" , protect() , allowedTo("doctor") , getAllLaboratories);
// doctorRouter.get("/find-doc-by-id" , protect(patientModel) , findDocById);

// doctorRouter.get("/find-doc-by-speciality" , protect(patientModel) , findDocBySpeciality);

export default labRouter;
