import mongoose from "mongoose";

const testSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "patient",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "doctor", // Assuming all doctors (including labs) are in one model
      required: true,
    },
    laboratoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "doctor",
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    testResult: {
      type: String,
    },
  },
  {
    minimize: false,
    timestamps: true,
  }
);

const testModel =
  mongoose.models.test || mongoose.model("test", testSchema);

export default testModel;
