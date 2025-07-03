import mongoose from "mongoose";
import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";

// Replace with your actual Mongo URI
const MONGO_URI = 'mongodb+srv://ahmed:ahmed_yasser2002@cluster0.v8lap.mongodb.net/medco';

const cloudinaryImageURL = "https://res.cloudinary.com/dojelkeau/image/upload/v1/Doctors/doctor.jpeg";

// Use only allowed `speciality` values from schema
const seedLaboratories = [
  {
    name: "Lab Admin",
    email: "lab.admin@medco.com",
    password: "labadmin123",
    role: "laboratory",
    image: cloudinaryImageURL,
    speciality: "Pathologist", // ✅ allowed
    degree: "PhD in Pathology",
    experience: "15 years",
    about: "Head of lab operations and pathology analysis.",
    fees: 0,
    address: { street: "1 Lab Central", city: "Cairo", country: "Egypt" },
    date: Date.now(),
  },
  {
    name: "Dr. Lina Mostafa",
    email: "lina.mostafa@medco.com",
    password: "12345678",
    role: "laboratory",
    image: cloudinaryImageURL,
    speciality: "Radiologist", // ✅ allowed
    degree: "MSc in Biochemistry",
    experience: "10 years",
    about: "Expert in biochemical lab testing and reporting.",
    fees: 350,
    address: { street: "2 Lab Street", city: "Alexandria", country: "Egypt" },
    date: 1710000000000,
  },
  {
    name: "Dr. Rami Fathy",
    email: "rami.fathy@medco.com",
    password: "12345678",
    role: "laboratory",
    image: cloudinaryImageURL,
    speciality: "Pathologist", // ✅ allowed
    degree: "MSc in Microbiology",
    experience: "8 years",
    about: "Specialist in infectious disease diagnostics.",
    fees: 300,
    address: { street: "3 Medical Lab", city: "Giza", country: "Egypt" },
    date: 1710000000000,
  },
];

async function seedLaboratoriesDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Only delete previous labs
    await doctorModel.deleteMany({ role: "laboratory" });
    console.log("🧪 Cleared existing laboratories");

    // Hash passwords
    for (const lab of seedLaboratories) {
      lab.password = await bcrypt.hash(lab.password, 10);
    }

    // Insert labs
    await doctorModel.insertMany(seedLaboratories);
    console.log("🌱 Laboratories seeded successfully");

    process.exit();
  } catch (error) {
    console.error("❌ Failed to seed laboratories:", error);
    process.exit(1);
  }
}

seedLaboratoriesDB();
