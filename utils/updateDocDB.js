import mongoose from "mongoose";
import patientModel from "../models/doctorModel.js"; // Adjust this path if needed
import doctorModel from "../models/doctorModel.js";

const MONGO_URI = 'mongodb+srv://ahmed:ahmed_yasser2002@cluster0.v8lap.mongodb.net/medco';

const cloudinaryBaseURL = 'https://res.cloudinary.com/dojelkeau/image/upload/v1749593930/doctor_tf8trz.jpg';


async function updateDocImages() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const result = await doctorModel.updateMany(
      {},
      { $set: { image: cloudinaryBaseURL } } // use 'profilePic' or the correct field name if different
    );

    console.log(`✅ Updated ${result.modifiedCount} docotrs with the image.`);
    process.exit();
  } catch (error) {
    console.error("❌ Failed to update doctors images:", error);
    process.exit(1);
  }
}

updateDocImages();
