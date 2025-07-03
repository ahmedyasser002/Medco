import doctorModel from "../models/doctorModel.js";

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

    res.status(200).json({ success: true, tests: lab.tests || [] });
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
      ...test,
      patientId,
      createdAt: Date.now()
    };

    lab.tests.push(testEntry);

    await lab.save();

    res.status(201).json({ success: true, message: "Test added successfully", tests: lab.tests });
  } catch (error) {
    console.error("Error adding test:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export {getAllLaboratories, getTests , addTest}