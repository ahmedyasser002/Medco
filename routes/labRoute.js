import express from "express";
import { allowedTo, protect } from "../middlewares/auth-middleware.js";
import { addTest, completeTest, getAllLaboratories, getTests } from "../controllers/laboratoryController.js";

const labRouter = express.Router();

labRouter.get("/get-lab" , protect() , allowedTo("doctor") , getAllLaboratories);
labRouter.get("/get-tests", protect() , allowedTo("laboratory") , getTests);
labRouter.post("/add-test", protect() , allowedTo("doctor") , addTest);
labRouter.patch("/complete-test", protect() , allowedTo("laboratory") , completeTest);


export default labRouter;
