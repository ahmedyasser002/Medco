import 'dotenv/config';
import mongoose from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb+srv://ahmed:ahmed_yasser2002@cluster0.v8lap.mongodb.net/medco?retryWrites=true&w=majority';

async function deleteAppointments() {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log("✅ Connected to MongoDB");

    console.time("deleteAppointments");
    await mongoose.connection.collection('appointments').deleteMany({});
    console.timeEnd("deleteAppointments");

    console.log("🗑️ All documents in 'appointments' collection deleted.");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error deleting appointments:", error);
    process.exit(1);
  }
}

deleteAppointments();
