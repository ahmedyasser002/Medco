import validator from "validator"
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js"
import jwt from 'jsonwebtoken'


// API for adding doctor
const addDoctor = async (req,res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
        const imageFile = req.file

        // console.log({ name, email, password, speciality, degree, experience, about, fees, address } , imageFile);
        
        // checking for all data to add doctor
        if (!name || !email || !password || !speciality || ! degree || !experience || !about || !fees || !address) {
            return res.status(400).json({ success:false , message: "Please fill all the fields" });
        }

        // validating email format
        if (validator.isEmail(email)) {
            return res.status(400).json({ success:false , message: "Please Enter Valid Email " });
        }

        // validating strong password
        if (password.length <8) {
            return res.status(400).json({ success:false , message: "Please Enter Strong Passowrd" });
        }

        // hashing doctor password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        // Upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path , {resource_type: "image"})
        const imageUrl = imageUpload.secure_url
        
        const doctorData = {
            name,
            email,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            image: imageUrl,
            address: JSON.parse(address),
            date: Date.now()

        }

        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()
        res.status(201).json({ success:true , message: "Doctor Added Successfully" , doctorData})


    
    } catch (error) {
        console.log(error);
        res.status(500).json({ success:false , message: error.message });
        
    }
}

// API for admin login
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email+password, process.env.JWT_SECRET,)
            res.status(200).json({ success: true, message: "Admin logged in successfully", token})
        }
        else{
            return res.status(400).json({ success:false , message: "Invalid Email or Password"})
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ success:false , message: error.message });

    }
}

export {addDoctor , loginAdmin}