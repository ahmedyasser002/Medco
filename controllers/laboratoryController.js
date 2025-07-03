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
export {getAllLaboratories}