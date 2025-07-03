import doctorModel from "../models/doctorModel.js";
import patientModel from "../models/patientModel.js";
import mongoose from "mongoose";

const getAllLaboratories = async (req, res) => {
  try {

    // Always filter by role: "doctor"
    const filter = {
      role: "laboratory",
    };

    const laboratories = await doctorModel.find(filter).select("name _id");
    res.status(200).json({ success: true, data: laboratories });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/laboratories/get-tests


const getTests = async (req, res) => {
  try {
    const labId = req.user._id;

    const lab = await doctorModel.findById(labId);

    if (!lab || lab.role !== "laboratory") {
      return res.status(404).json({ success: false, message: "Laboratory not found" });
    }

    const tests = lab.tests || [];

    // Get all unique patientIds
    const patientIds = [
      ...new Set(
        tests
          .filter(test => test.patientId)
          .map(test => test.patientId.toString())
      )
    ];

    const patients = await patientModel.find({ _id: { $in: patientIds } }).select("-password");

    const patientMap = new Map();
    for (const patient of patients) {
      patientMap.set(patient._id.toString(), patient);
    }

    const result = tests
      .filter(test => test.patientId)
      .map(test => {
        const patient = patientMap.get(test.patientId.toString());
        return {
          patient,
          test
        };
      })
      .filter(entry => entry.patient);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching tests:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


const addTest = async (req, res) => {
  try {
    const { patientId, laboratoryId, test } = req.body;

    if (!laboratoryId || !test || !test.name) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const lab = await doctorModel.findById(laboratoryId);

    if (!lab || lab.role !== "laboratory") {
      return res.status(404).json({ success: false, message: "Laboratory not found" });
    }

    // Optionally add patientId to test record
   const testEntry = {
     _id: new mongoose.Types.ObjectId(),
      patientId,
      createdAt: Date.now(),
      ...req.body

    };

    lab.tests.push(testEntry);

    await lab.save();

    res.status(201).json({ success: true, message: "Test added successfully", tests: lab.tests });
  } catch (error) {
    console.error("Error adding test:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const completeTest = async (req, res) => {
  const { testId } = req.body;

  try {
    // Find the lab that contains the test
   const lab = await doctorModel.findOne({
  role: "laboratory",
  tests: {
    $elemMatch: { _id: new mongoose.Types.ObjectId(testId) }
  }
});


    if (!lab) {
      return res.status(404).json({ success: false, message: "Test not found in any lab" });
    }

    // Find the test in the lab's tests array
    const test = lab.tests.id(testId);

    if (!test) {
      return res.status(404).json({ success: false, message: "Test not found" });
    }

    // Update the isCompleted field
    test.isCompleted = true;

    // Save the updated lab document
    await lab.save();

    res.status(200).json({ success: true, message: "Test marked as completed", data: test });
  } catch (error) {
    console.error("Error updating test:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



export {getAllLaboratories, getTests , addTest , completeTest}