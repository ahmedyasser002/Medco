import mongoose from "mongoose";
import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";

const MONGO_URI = 'mongodb+srv://ahmed:ahmed_yasser2002@cluster0.v8lap.mongodb.net/medco';

const cloudinaryImageURL = "https://res.cloudinary.com/dojelkeau/image/upload/v1/Doctors/doctor.jpeg";

const seedDoctors = [
    {
    name: "Admin",
    email: "admin@admin.com",
    password: "admin1234",
    role: "admin",
    image: cloudinaryImageURL,
    speciality: "Surgeon",
    degree: "-",
    experience: "-",
    about: "System administrator with full access.",
    fees: 0,
    address: { street: "-", city: "-", country: "-" },
    date: Date.now(),
  },
  {
    name: "Dr. Ahmed Hossam",
    email: "ahmed.hossam@gmail.com",
    password: "12345678",
    image: cloudinaryImageURL,
    speciality: "Cardiologist",
    degree: "MBBS, MD",
    experience: "10 years",
    about: "Passionate about heart health and cardiovascular care.",
    fees: 500,
    address: { street: "15 Tahrir St.", city: "Cairo", country: "Egypt" },
    date: 1710000000000,
  },
  {
    name: "Dr. Mariam Samir",
    email: "mariam.samir@gmail.com",
    password: "12345678",
    image: cloudinaryImageURL,
    speciality: "Dermatologist",
    degree: "MBBS, MSc",
    experience: "7 years",
    about: "Specialist in skin care and cosmetic dermatology.",
    fees: 400,
    address: { street: "22 El Nasr Rd.", city: "Alexandria", country: "Egypt" },
    date: 1710000000000,
  },
  {
    name: "Dr. Youssef Nabil",
    email: "youssef.nabil@gmail.com",
    password: "12345678",
    image: cloudinaryImageURL,
    speciality: "Neurologist",
    degree: "MBBS, PhD",
    experience: "12 years",
    about: "Expert in treating neurological conditions and brain health.",
    fees: 600,
    address: { street: "10 October St.", city: "Giza", country: "Egypt" },
    date: 1710000000000,
  },
  {
    name: "Dr. Salma Atef",
    email: "salma.atef@gmail.com",
    password: "12345678",
    image: cloudinaryImageURL,
    speciality: "Gynecologist",
    degree: "MBBS, MD",
    experience: "9 years",
    about: "Focused on women’s reproductive health and wellness.",
    fees: 450,
    address: { street: "5 El Mohandessin", city: "Cairo", country: "Egypt" },
    date: 1710000000000,
  },
  {
    name: "Dr. Omar Tarek",
    email: "omar.tarek@gmail.com",
    password: "12345678",
    image: cloudinaryImageURL,
    speciality: "General Physician",
    degree: "MBBS",
    experience: "6 years",
    about: "Trusted GP for common conditions and chronic care.",
    fees: 350,
    address: { street: "12 El Rehab", city: "New Cairo", country: "Egypt" },
    date: 1710000000000,
  },
  {
    name: "Dr. Nourhan Khaled",
    email: "nourhan.khaled@gmail.com",
    password: "12345678",
    image: cloudinaryImageURL,
    speciality: "Pediatrician",
    degree: "MBBS, DCH",
    experience: "8 years",
    about: "Specialist in child health and development.",
    fees: 400,
    address: { street: "9 El Maadi", city: "Cairo", country: "Egypt" },
    date: 1710000000000,
  },
  {
    name: "Dr. Mostafa Adel",
    email: "mostafa.adel@gmail.com",
    password: "12345678",
    image: cloudinaryImageURL,
    speciality: "Radiologist",
    degree: "MBBS, MD",
    experience: "11 years",
    about: "Expert in radiology and medical imaging diagnostics.",
    fees: 550,
    address: { street: "4 El Haram", city: "Giza", country: "Egypt" },
    date: 1710000000000,
  },
  {
    name: "Dr. Dalia Hussein",
    email: "dalia.hussein@gmail.com",
    password: "12345678",
    image: cloudinaryImageURL,
    speciality: "Psychiatrist",
    degree: "MBBS, MSc",
    experience: "9 years",
    about: "Dedicated to mental health and psychiatric care.",
    fees: 600,
    address: { street: "21 El Mansoura", city: "Mansoura", country: "Egypt" },
    date: 1710000000000,
  },
  {
    name: "Dr. Kareem Farid",
    email: "kareem.farid@gmail.com",
    password: "12345678",
    image: cloudinaryImageURL,
    speciality: "Endocrinologist",
    degree: "MBBS, MD",
    experience: "13 years",
    about: "Focuses on hormone disorders and diabetes treatment.",
    fees: 500,
    address: { street: "8 El Shatby", city: "Alexandria", country: "Egypt" },
    date: 1710000000000,
  },
  {
    name: "Dr. Huda Nasser",
    email: "huda.nasser@gmail.com",
    password: "12345678",
    image: cloudinaryImageURL,
    speciality: "Oncologist",
    degree: "MBBS, DM",
    experience: "15 years",
    about: "Specialized in cancer treatment and oncology care.",
    fees: 700,
    address: { street: "3 El Mahalla", city: "Tanta", country: "Egypt" },
    date: 1710000000000,
  },
];

async function seedDoctorsDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await doctorModel.deleteMany();
    console.log("🗑️ Cleared doctors collection");

    for (const doctor of seedDoctors) {
      doctor.password = await bcrypt.hash(doctor.password, 10);
    }

    await doctorModel.insertMany(seedDoctors);
    console.log("🌱 Doctors seeded successfully");

    process.exit();
  } catch (error) {
    console.error("❌ Failed to seed doctors:", error);
    process.exit(1);
  }
}

seedDoctorsDB();
