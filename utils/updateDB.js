import mongoose from "mongoose";
import patientModel from "../models/patientModel.js"; // Adjust this path if needed

const MONGO_URI = 'mongodb+srv://ahmed:ahmed_yasser2002@cluster0.v8lap.mongodb.net/medco';

const cloudinaryBaseURL = 'https://res.cloudinary.com/dojelkeau/image/upload/v1749595751/patient_x96gnr.jpg';

async function updatePatientImages() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const result = await patientModel.updateMany(
      {},
      { $set: { image: cloudinaryBaseURL } } // use 'profilePic' or the correct field name if different
    );

    console.log(`✅ Updated ${result.modifiedCount} patients with the image.`);
    process.exit();
  } catch (error) {
    console.error("❌ Failed to update patient images:", error);
    process.exit(1);
  }
}

updatePatientImages();
