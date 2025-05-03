import express from 'express'
import { addDoctor, deleteDoctor, loginAdmin } from '../controllers/adminController.js'
import upload from '../middlewares/multer.js'
import authAdmin from '../middlewares/authAdmin.js'

const adminRouter = express.Router()
adminRouter.post('/add-doctor', authAdmin , upload.single('image'), addDoctor)
adminRouter.post('/login', loginAdmin)
adminRouter.delete('/delete-doctor' , authAdmin , deleteDoctor);
export default adminRouter