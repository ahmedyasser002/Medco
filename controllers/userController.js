import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary';


// API to Register User
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !password || !email) {
            return res.status(400).json({success:false , message: "Please fill in all fields" });
        }

        // validating Email Format
        if (!validator.isEmail(email)) {
            return res.status(400).json({success:false , message: "Invalid email address" });
        }

        // Validating Strong Password
        if (password.length < 8) {
            return res.status(400).json({success:false , message: "Password must be at least 8"})
        }

        // Hashing User Password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            name,
            email,
            password: hashedPassword
        }

        // Creating User in Database
        const newUser = new userModel(userData);
        const user = await newUser.save();
        // res.status(201).json({success:true , message: "User created successfully"  , user});

        const token = jwt.sign({id:user._id} , process.env.JWT_SECRET)
        res.status(201).json({success:true , message: "User created successfully", token, user });
        
    } catch (error) {
        res.status(500).json({success:false , message: error.message });
        
    }
}

// API for User Login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({success:false , message: "Please fill in all fields"})
        }
        // Find User in Database
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({success:false , message: "Invalid email or password"})
        }
        // Comparing Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({success:false , message: "Invalid email or password"});
        }
        // Generating Token
        const token = jwt.sign({id:user._id} , process.env.JWT_SECRET)
        res.status(200).json({success:true , message: "Logged in successfully", token,})
        
    } catch (error) {
        res.status(500).json({success:false , message: error.message });
    }
}

// API to Get User Profile Data
const getProfile = async (req, res) => {
    try {
        const  userId = req.userId
        const userData = await userModel.findById(userId).select('-password')
        res.status(200).json({success:true , message: "User Profile Data", userData})
        
    } catch (error) {
        res.status(500).json({success:false , message: error.message });
        
    }
}

// API to Update User Profile
const updateProfile = async (req,res) =>{
    try {
        const {userId , name , phone , address ,dob , gender} = req.body;
        const imageFile = req.file
        if (!name || !phone || !dob || !gender) {
            res.status(400).json({success:false , message: error.message });
        }
        await userModel.findByIdAndUpdate(userId , {name , phone , address:JSON.parse(address)})

        if (imageFile) {
            // Upload Image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path , {resource_type: 'image'})
        }
    } catch (error) {
        res.status(500).json({success:false , message: error.message });
    }

}

export {registerUser , loginUser , getProfile}