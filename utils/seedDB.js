import mongoose from "mongoose";
import patientModel from "../models/patientModel.js"; // Adjust if needed
import bcrypt from "bcrypt";

const MONGO_URI = 'mongodb+srv://ahmed:ahmed_yasser2002@cluster0.v8lap.mongodb.net/medco' // ✅ Change this

const seedPatients = [
  {
    firstName: "Ahmed",
    lastName: "Yasser",
    nationalID: "30101010101011",
    email: "ahmed.yasser@gmail.com",
    password: "12345678",
    gender: "Male",
    dob: "2001-01-01",
    phone: "01012345678",
  },
  {
    firstName: "Fatma",
    lastName: "Khaled",
    nationalID: "30202020202022",
    email: "fatma.khaled@gmail.com",
    password: "12345678",
    gender: "Female",
    dob: "2002-02-02",
    phone: "01087654321",
  },
  {
    firstName: "Mohamed",
    lastName: "Saeed",
    nationalID: "30303030303033",
    email: "mohamed.saeed@gmail.com",
    password: "12345678",
    gender: "Male",
    dob: "2000-03-03",
    phone: "01111222333",
  },
  {
    firstName: "Menna",
    lastName: "Hussein",
    nationalID: "30404040404044",
    email: "menna.hussein@gmail.com",
    password: "12345678",
    gender: "Female",
    dob: "2003-04-04",
    phone: "01234567890",
  },
  {
    firstName: "Kareem",
    lastName: "Adel",
    nationalID: "30505050505055",
    email: "kareem.adel@gmail.com",
    password: "12345678",
    gender: "Male",
    dob: "2001-05-05",
    phone: "01055555555",
  },
  {
    firstName: "Salma",
    lastName: "Amin",
    nationalID: "30606060606066",
    email: "salma.amin@gmail.com",
    password: "12345678",
    gender: "Female",
    dob: "2002-06-06",
    phone: "01166666666",
  },
  {
    firstName: "Youssef",
    lastName: "Mostafa",
    nationalID: "30707070707077",
    email: "youssef.mostafa@gmail.com",
    password: "12345678",
    gender: "Male",
    dob: "2000-07-07",
    phone: "01277777777",
  },
  {
    firstName: "Nour",
    lastName: "Ibrahim",
    nationalID: "30808080808088",
    email: "nour.ibrahim@gmail.com",
    password: "12345678",
    gender: "Female",
    dob: "2004-08-08",
    phone: "01088888888",
  },
  {
    firstName: "Ali",
    lastName: "Hassan",
    nationalID: "30909090909099",
    email: "ali.hassan@gmail.com",
    password: "12345678",
    gender: "Male",
    dob: "1999-09-09",
    phone: "01199999999",
  },
  {
    firstName: "Malak",
    lastName: "Ramadan",
    nationalID: "31010101010100",
    email: "malak.ramadan@gmail.com",
    password: "12345678",
    gender: "Female",
    dob: "2003-10-10",
    phone: "01200000000",
  },
];

async function seedDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await patientModel.deleteMany();
    console.log("🗑️ Cleared patients collection");

    for (const patient of seedPatients) {
      patient.password = await bcrypt.hash(patient.password, 10);
    }

    await patientModel.insertMany(seedPatients);
    console.log("🌱 Seeding complete");

    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seedDB();
