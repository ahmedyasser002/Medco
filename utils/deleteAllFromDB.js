import 'dotenv/config';
import mongoose from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb+srv://ahmed:ahmed_yasser2002@cluster0.v8lap.mongodb.net/medco?retryWrites=true&w=majority';

async function dropDatabase() {
  try {
    await mongoose.connect(MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    await mongoose.connection.dropDatabase();
    console.log("🗑️ Entire database dropped.");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error dropping DB:", error);
    process.exit(1);
  }
}

dropDatabase();
