import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import patientModel from "../models/patientModel.js";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import laboratoryModel from "../models/laboratoryModel.js";
import streamifier from "streamifier";  // Required if using memoryStorage
import sharp from "sharp";
import uploadAndResizeImage  from "../utils/uploadAndResizeImage.js";
// API for adding doctor
const addDoctor = async (req, res) => {
  
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
      status
    } = req.body;
    const imageFile = req.file;

    // console.log({ name, email, password, speciality, degree, experience, about, fees, address } , imageFile);

    // checking for all data to add doctor
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all the fields" });
    }

    // validating email format
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Please Enter Valid Email " });
    }

    // validating strong password
    if (password.length < 8) {
      return res
        .status(400)
        .json({ success: false, message: "Please Enter Strong Passowrd" });
    }

    // hashing doctor password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let imageUrl = null;

    // Upload image to cloudinary
    if (imageFile) {
      imageUrl = await uploadAndResizeImage(imageFile, "Doctors");
    }
    

    const doctorData = {
      name,
      email,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      status,
      image: imageUrl,
      address: JSON.parse(address),
      date: Date.now(),

    };

    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();
    res.status(201).json({
      success: true,
      message: "Doctor Added Successfully",
      doctorData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }


};

// API for admin login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.status(200).json({
        success: true,
        message: "Admin logged in successfully",
        role: "admin",
        token,
      });
    } else if (await doctorModel.findOne({ email })) {
      const doctor = await doctorModel.findOne({ email });

      const token = jwt.sign(doctor._id, process.env.JWT_SECRET);

      res.status(200).json({
        success: true,
        message: "Doctor logged in successfully",
        role: "doctor",
        token,
        id: doctor._id,
      });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Email or Password" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API for deleting doctor

const deleteDoctor = async (req, res) => {
  try {
    const { docId } = req.body;
    await doctorModel.findByIdAndDelete(docId);
    res.status(200).json({ success: true, message: "Doc Deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const deletePatient = async (req, res) => {
  try {
    const { patientId } = req.body;
    await patientModel.findByIdAndDelete(patientId);
    res.status(200).json({ success: true, message: "Patient Deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAppointmentList = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});
    res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Add Laboratory
const addLaboratory = async (req, res) => {
  try {
    const { name, email, password, experience, fees, address } = req.body;

    // checking for all data to add doctor
    if (!name || !email || !password || !experience || !fees || !address) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all the fields" });
    }

    // validating email format
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Please Enter Valid Email " });
    }

    // validating strong password
    if (password.length < 8) {
      return res
        .status(400)
        .json({ success: false, message: "Please Enter Strong Passowrd" });
    }

    // hashing admin password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const laboratoryData = {
      name,
      email,
      password: hashedPassword,
      speciality,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      date: Date.now(),
    };

    const newlaboratory = new laboratoryModel(laboratoryData);
    await newlaboratory.save();
    res.status(201).json({
      success: true,
      message: "laboratory Added Successfully",
      doctorData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const sendDataForBarPlot = async (req, res) => {
  try {
    const data = await doctorModel.aggregate([
      {
        $group: {
          _id: "$speciality",
          count: { $sum: 1 }
        }
      }
    ]);

    // Transform result into array: [{ id, label, value, color }]
    const formattedData = data.map((item, index) => ({
      id: item._id,
      label: item._id,
      value: item.count,
      // color: `hsl(${(index * 50) % 360}, 70%, 50%)`
    }));

    res.status(200).json({
      success: true,
      data: formattedData
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const sendDateForPiePlot = async (req, res) => {
  try {
    const data = await doctorModel.aggregate([
      {
        $group: {
          _id: "$experience",
          count: { $sum: 1 }
        }
      }
    ]);

    const formattedData = data.map((item, index) => ({
      id: item._id,
      label: item._id,
      value: item.count,
      // color: `hsl(${(index * 45) % 360}, 70%, 50%)`
    }));

    res.status(200).json({
      success: true,
      data: formattedData
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAppointmentCount = async (req, res) => {
  try {
    const count = await appointmentModel.countDocuments(); // Efficient count
    res.status(200).json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const getTotalFees = async (req,res) => {
  try {
    const result = await appointmentModel.aggregate([
    {
      $group: {
        _id: null,
        totalFees: { $sum: "$docData.fees" }
      }
    }
  ]);

  res.status(200).json({success:true, data:result[0]?.totalFees || 0}) ;
    
  } catch (error) {
    
  }
  
};



export {
  addDoctor,
  loginAdmin,
  deleteDoctor,
  deletePatient,
  getAppointmentList,
  sendDataForBarPlot,
  sendDateForPiePlot,
  getAppointmentCount,
  getTotalFees
};
