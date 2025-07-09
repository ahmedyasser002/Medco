import mongoose from "mongoose";
import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";

const MONGO_URI = 'mongodb+srv://ahmed:ahmed_yasser2002@cluster0.v8lap.mongodb.net/medco';

const cloudinaryImageURL = "https://res.cloudinary.com/dojelkeau/image/upload/v1751830221/Doctors/j5i4vrzzgnrwlnn7gytd.jpg";
const cloudinaryFemaleImageURL = "https://res.cloudinary.com/dojelkeau/image/upload/v1752017130/doctor_qk2wrd.jpg";

const seedDoctors = [
  // ✅ New doctors for missing specialities
  {
    name: "Dr. Sara Mahmoud",
    email: "sara.mahmoud@gmail.com",
    password: "12345678",
    speciality: "Gastroenterologist",
    degree: "MBBS, MD",
    experience: "8 years",
    about: "Specialist in digestive system disorders and treatments.",
    fees: 480,
    address: { street: "17 Abbas St.", city: "Cairo", country: "Egypt" },
    date: 1710000000000,
  },
  {
    name: "Dr. Tarek Hamdy",
    email: "tarek.hamdy@gmail.com",
    password: "12345678",
    speciality: "Urologist",
    degree: "MBBS, MD",
    experience: "9 years",
    about: "Experienced in treating urinary tract conditions and surgery.",
    fees: 500,
    address: { street: "7 Dokki Sq.", city: "Giza", country: "Egypt" },
    date: 1710000000000,
  },
  {
    name: "Dr. Rana Adel",
    email: "rana.adel@gmail.com",
    password: "12345678",
    speciality: "Ophthalmologist",
    degree: "MBBS, MSc",
    experience: "6 years",
    about: "Focused on eye care, vision, and laser surgery.",
    fees: 450,
    address: { street: "19 Mostafa Kamel St.", city: "Alexandria", country: "Egypt" },
    date: 1710000000000,
  },
  {
    name: "Dr. Amr Refaat",
    email: "amr.refaat@gmail.com",
    password: "12345678",
    speciality: "Pathologist",
    degree: "MBBS, MD",
    experience: "11 years",
    about: "Expert in disease diagnosis using lab methods and tissues.",
    fees: 470,
    address: { street: "3 Sidi Gaber", city: "Alexandria", country: "Egypt" },
    date: 1710000000000,
  },

  // ✅ Original existing doctors
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

      const lowerName = doctor.name.toLowerCase();
      if (
        lowerName.includes("mariam") ||
        lowerName.includes("salma") ||
        lowerName.includes("nourhan") ||
        lowerName.includes("dalia") ||
        lowerName.includes("huda") ||
        lowerName.includes("rana") ||
        lowerName.includes("sara")
      ) {
        doctor.image = cloudinaryFemaleImageURL;
      } else {
        doctor.image = cloudinaryImageURL;
      }
    }

    await doctorModel.insertMany(seedDoctors);
    console.log("🌱 All doctors seeded successfully");

    process.exit();
  } catch (error) {
    console.error("❌ Failed to seed doctors:", error);
    process.exit(1);
  }
}

seedDoctorsDB();
