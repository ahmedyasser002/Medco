import mongoose from "mongoose";

const laboratorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    speciality: {
        type: String,
        required: true
    },

    experience: {
        type: String,
        required: true
    },

    fees: {
        type: Number,
        required: true
    },
    address: {
        type: Object,
        required: true
    },
    date: {
        type: Number,
        required: true
    }
},{
    minimize:false

})

const laboratoryModel = mongoose.models.laboratory || mongoose.model('laboratory' , laboratorySchema)

export default laboratoryModel