import validator from "validator";
import bcrypt from "bcrypt";
import patientModel from "../models/patientModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";

// API to Register User
const registerPatient = async (req, res) => {
  try {
    const { name, email, password , gender } = req.body;
    if (!name || !password || !email || !gender) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill in all fields" });
    }

    // validating Email Format
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email address" });
    }

    // Validating Strong Password
    if (password.length < 8) {
      return res
        .status(400)
        .json({ success: false, message: "Password must be at least 8" });
    }

    // Hashing User Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
      gender
    };

    // Creating User in Database
    const newUser = new patientModel(userData);
    const user = await newUser.save();
    // res.status(201).json({success:true , message: "User created successfully"  , user});

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res
      .status(201)
      .json({
        success: true,
        message: "User created successfully",
        token,
        user,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// API for User Login
const loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill in all fields" });
    }
    // Find User in Database
    const user = await patientModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }
    // Comparing Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }
    // Generating Token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res
      .status(200)
      .json({ success: true, message: "Logged in successfully", token , user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to Get User Profile Data
const getProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const userData = await patientModel.findById(userId).select("-password");
    res
      .status(200)
      .json({ success: true, message: "User Profile Data", userData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    // const userId = req.user._id
        const userId = req.user._id;  // get id from auth middleware

    const { name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    // Ensure userId is provided
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Missing required field: userId",
      });
    }

    const updateData = {};

    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (dob) updateData.dob = dob;
    if (gender) updateData.gender = gender;

    if (address) {
      try {
        updateData.address = JSON.parse(address);
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: "Invalid address format. Must be valid JSON.",
        });
      }
    }

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      updateData.image = imageUpload.secure_url;
    }

    const updatedUser = await patientModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });

  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPatientList = async (req,res)=>{

 try {

        const patients = await patientModel.find({}).select(['-password']);
        res.status(200).json({ success: true, data: patients });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
        
    }
}
export { registerPatient, loginPatient, getProfile, updateProfile , getPatientList }