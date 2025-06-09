import laboratoryModel from "../models/laboratoryModel";

// API for Laboratory Login
const loginLaboratory = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill in all fields" });
    }
    // Find User in Database
    const laboratory = await laboratoryModel.findOne({ email });
    if (!laboratory) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }
    // Comparing Password
    const isMatch = await bcrypt.compare(password, laboratory.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }
    // Generating Token
    const token = jwt.sign({ id: laboratory._id }, process.env.JWT_SECRET);
    res
      .status(200)
      .json({ success: true, message: "Logged in successfully", token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to Get User Profile Data
const getProfile = async (req, res) => {
  try {
    const laboratoryId = req.userId;
    const laboratoryData = await laboratoryModel.findById(laboratoryId).select("-password");
    res
      .status(200)
      .json({ success: true, message: "User Profile Data", userData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {loginLaboratory , getProfile};