import testModel from "../models/testModel.js"; // adjust path if needed
import doctorModel from "../models/doctorModel.js"; // for checking lab
import patientModel from "../models/patientModel.js"; // for optional validation

const addTest = async (req, res) => {
  try {
    const { patientId, laboratoryId, doctorId, name } = req.body;

    if (!laboratoryId || !name || !patientId || !doctorId) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Check that the lab exists and has role 'laboratory'
    const lab = await doctorModel.findOne({ _id: laboratoryId, role: "laboratory" });
    if (!lab) {
      return res.status(404).json({ success: false, message: "Laboratory not found" });
    }

    // Check that the doctor exists and has role 'doctor'
    const doctor = await doctorModel.findOne({ _id: doctorId, role: "doctor" });
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    // Optional: validate patient exists
    const patient = await patientModel.findById(patientId);
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    // Create the test record
    const newTest = await testModel.create({
      name,
      patientId,
      doctorId,
      laboratoryId,
    });

    res.status(201).json({ success: true, message: "Test created successfully", data: newTest });
  } catch (error) {
    console.error("Error adding test:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



const completeTest = async (req, res) => {
  const { testId, testResult } = req.body;

  if (!testId || !testResult) {
    return res.status(400).json({ success: false, message: "Test ID and result are required" });
  }

  try {
    const test = await testModel.findById(testId);

    if (!test) {
      return res.status(404).json({ success: false, message: "Test not found" });
    }

    test.isCompleted = true;
    test.testResult = testResult;

    await test.save();

    res.status(200).json({ success: true, message: "Test marked as completed", data: test });
  } catch (error) {
    console.error("Error completing test:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


import testModel from "../models/test.js";

const getTestsByPatientId = async (req, res) => {
  const { patientId } = req.params;

  try {
    const tests = await testModel.find({ patientId })
      .populate("doctorId", "name email")
      .populate("laboratoryId", "name email");

    res.status(200).json({ success: true, data: tests });
  } catch (error) {
    console.error("Error fetching tests by patientId:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


const getTestsByDoctorId = async (req, res) => {
  const { doctorId } = req.params;

  try {
    const tests = await testModel.find({ doctorId })
      .populate("patientId", "name email")
      .populate("laboratoryId", "name email");

    res.status(200).json({ success: true, data: tests });
  } catch (error) {
    console.error("Error fetching tests by doctorId:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


const getTestsByLaboratoryId = async (req, res) => {
  const { laboratoryId } = req.params;

  try {
    const tests = await testModel.find({ laboratoryId })
      .populate("patientId", "name email")
      .populate("doctorId", "name email");

    res.status(200).json({ success: true, data: tests });
  } catch (error) {
    console.error("Error fetching tests by laboratoryId:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export { addTest, completeTest, getTestsByDoctorId, getTestsByPatientId, getTestsByLaboratoryId}