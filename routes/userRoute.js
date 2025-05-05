import express from 'express'
import { registerUser , loginUser, getProfile, updateProfile, getPatientList } from '../controllers/userController.js'
import authUser from '../middlewares/authUser.js'
import authAdmin from '../middlewares/authAdmin.js'
import upload from '../middlewares/multer.js'

const userRouter = express.Router()

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.get('/get-profile' , authUser , getProfile)
userRouter.post('/update-profile' , upload.single('image'),authUser, updateProfile )
userRouter.get('/list' , authAdmin , getPatientList)




export default userRouter