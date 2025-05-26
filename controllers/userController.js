import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import razorpay from "razorpay";

// API to Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !password || !email) {
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
    };

    // Creating User in Database
    const newUser = new userModel(userData);
    const user = await newUser.save();
    // res.status(201).json({success:true , message: "User created successfully"  , user});

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
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
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill in all fields" });
    }
    // Find User in Database
    const user = await userModel.findOne({ email });
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
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res
      .status(200)
      .json({ success: true, message: "Logged in successfully", token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to Get User Profile Data
const getProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const userData = await userModel.findById(userId).select("-password");
    res
      .status(200)
      .json({ success: true, message: "User Profile Data", userData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to Update User Profile
const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    // Validate required fields
    if (!name || !phone || !dob || !gender) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: userId, name, phone, dob, or gender",
      });
    }

    // Parse address safely
    let parsedAddress;
    try {
      parsedAddress = address ? JSON.parse(address) : {};
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Invalid address format. Must be valid JSON.",
      });
    }

    // Prepare update data
    const updateData = {
      name,
      phone,
      dob,
      gender,
      address: parsedAddress,
    };

    // Handle image upload if exists
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      updateData.image = imageUpload.secure_url;
    }

    // Perform update
    const updatedUser = await userModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    // Check if user was found
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User found",
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
       

        const patients = await userModel.find({}).select(['-password']);
        res.status(200).json({ success: true, data: patients });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
        
    }
}


// API to book appointment
const bookAppointment = async (req ,res)=>{
  try {
    const userId = req.userId;
    const { docId , slotDate , slotTime} = req.body;
    const docData = await doctorModel.findById(docId).select('-password');
    if (!docData.available) {
      return res.status(200).json({success:false ,  message: "Doctor Not Available"});
    }
    let slots_booked = docData.slots_booked;

    // Checking for slots availability
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.status(200).json({success:false ,  message: "Doctor Not Available"});       
      }
      else{
        slots_booked[slotDate].push(slotTime);
      }
    }
    else{
      slots_booked[slotDate] = []
      slots_booked[slotDate].push(slotTime)
    }
    const userData = await userModel.findById(userId).select('-password');
    delete docData.slots_booked;
    
    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now()
    }

    const newAppointment = new appointmentModel(appointmentData)
    await newAppointment.save();
    
    await doctorModel.findByIdAndUpdate(docId , {slots_booked});
    res.status(200).json({ success: true, message: 'Appointment Booked' });


  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
    
  }
}

// Api to get user appointments for frontend my-appointments page

const listAppointment = async(req,res)=>{

  try {

    const userId = req.userId;
    const appointments = await appointmentModel.find({userId})

    return res.status(200).json({success:true , data: appointments});

    
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
}

// API to cancel appointment
const cancelAppointment = async(req,res) =>{
  try {
    const userId = req.userId;
    const {appointmentId} = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    // verify appointment user
    if (appointmentData.userId !== userId) {
      return res.status(401).json({success:false , message:'unauthorized'});
    }

    await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true});

    // releasing doctor slot
    const {docId , slotDate , slotTime} = appointmentData;
    const doctorData = await doctorModel.findById(docId);
    let slots_booked = doctorData.slots_booked;
    slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);
    await doctorModel.findByIdAndUpdate(docId , {slots_booked});

    res.status(200).json({message:true, message: 'Appointment cancelled'});

  } 
  catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
}

const razorpayInstance = new razorpay({
  key_id:'',
  key_secret:''
})
// API to make payment 
const paymentRazorpay = async(req,res) =>{

}


export { registerUser, loginUser, getProfile, updateProfile , getPatientList , bookAppointment , listAppointment , cancelAppointment };
