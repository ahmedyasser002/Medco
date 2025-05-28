import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import appointmentModel from "../models/appointmentModel.js";
import mongoose from "mongoose";

const createToken = (id) =>
  jwt.sign({ userId: id }, process.env.JWT_SECRET);

const sanitizeDoctor = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const login = async (req, res, next) => {
  // 1- Check if password and email in the body (valdiation)
  const { email, password } = req.body;
  const doctor = await doctorModel.findOne({ email });

  if (!doctor) {
    res
      .status(401)
      .json({ success: true, message: "Invalid email or password" });
  }

  // 2- Check if users exists and password is correct
  const isMatch = await bcrypt.compare(password, doctor.password);

  if (!isMatch) {
    res
      .status(401)
      .json({ success: true, message: "Invalid email or password" });
  }

  // 3- Generate JWT token
  const token = createToken(doctor._id);

  res.status(201).json({ data: sanitizeDoctor(doctor), token });
};

const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;
    const docData = await doctorModel.findById(docId);
    await doctorModel.findByIdAndUpdate(docId, {
      available: !docData.available,
    });
    res.status(200).json({ success: true, message: "Availability Changed" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllDoctors = async (req, res) => {
  try {
    const { speciality } = req.query;

    const filter = speciality ? { speciality } : {};

    const doctors = await doctorModel.find(filter).select(["-password"]);
    res.status(200).json({ success: true, data: doctors });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUsersWithAppointments = async (req, res) => {
  try {
    const doctorId = req.user._id;

    const appointments = await appointmentModel.find({
      "docId": doctorId,
    });

    // Extract userData from appointments
    const users = appointments.map(app => app.userData);

    // Remove duplicates by converting to a Map and back to array
    const uniqueUsers = users.filter((user, index, self) => 
      index === self.findIndex((u) => (
        u._id.toString() === user._id.toString()
      ))
    );

    res.status(200).json({ success: true, data: uniqueUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const findDocById = async (req,res) => {
  try {
    const userId = req.user._id;
     const { docId } = req.body;
    const docData = await doctorModel.findById(docId);
        res.status(200).json({ success: true, data: docData });

    
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
    
  }
  
}



// const doctorLogin

export { changeAvailability, getAllDoctors , login , getUsersWithAppointments  , findDocById };
