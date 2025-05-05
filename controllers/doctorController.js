import doctorModel from "../models/doctorModel.js";

const changeAvailability = async (req,res) => {
    try {
        const {docId} = req.body
        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId , {available: !docData.available})
        res.status(200).json({ success:true , message:"Availability Changed" });

        
    } catch (error) {
        console.log(error);
        res.status(500).json({ success:false , message:error.message});

    }
    
}

const doctorList = async (req, res) => {
    try {
        const { speciality } = req.query;

        const filter = speciality ? { speciality } : {};

        const doctors = await doctorModel.find(filter).select(['-password']);
        res.status(200).json({ success: true, data: doctors });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
        
    }
};

export {changeAvailability , doctorList}