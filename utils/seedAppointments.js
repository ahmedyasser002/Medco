import mongoose from "mongoose";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import patientModel from "../models/patientModel.js";

const MONGO_URI = 'mongodb+srv://ahmed:ahmed_yasser2002@cluster0.v8lap.mongodb.net/medco';

const randomDate = () => {
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  return now + Math.floor(Math.random() * 10) * oneDay;
};

const randomTime = () => {
  const hours = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "03:00 PM"];
  return hours[Math.floor(Math.random() * hours.length)];
};

async function seedAppointments() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear appointments
    await appointmentModel.deleteMany();
    console.log("🗑️ Cleared appointments collection");

    // Fetch seeded doctors and patients
    const doctors = await doctorModel.find({});
    const patients = await patientModel.find({});

    if (doctors.length < 10 || patients.length < 10) {
      console.log("❌ Make sure there are at least 10 doctors and 10 patients seeded.");
      process.exit(1);
    }

    const appointments = [];

    for (let i = 0; i < 10; i++) {
      const doc = doctors[i];
      const user = patients[i];

      appointments.push({
        userId: user._id.toString(),
        docId: doc._id.toString(),
        slotDate: new Date(randomDate()).toISOString().split("T")[0], // YYYY-MM-DD
        slotTime: randomTime(),
        userData: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          gender: user.gender,
          dob: user.dob,
        },
        docData: {
          name: doc.name,
          email: doc.email,
          speciality: doc.speciality,
          degree: doc.degree,
          experience: doc.experience,
          about: doc.about,
          fees: doc.fees,
          address: doc.address,
          image: doc.image,
        },
        amount: doc.fees,
        date: Date.now(),
        cancelled: false,
        payment: true,
        isCompleted: false,
      });
    }

    await appointmentModel.insertMany(appointments);
    console.log("📅 Seeded 10 appointments successfully");

    process.exit();
  } catch (error) {
    console.error("❌ Failed to seed appointments:", error);
    process.exit(1);
  }
}

seedAppointments();
