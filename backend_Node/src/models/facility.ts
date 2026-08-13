import mongoose from "mongoose";

const Schema = mongoose.Schema;
let Facility = new Schema({
    name: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    sports:{
        type: [String]
    },
    pricePerHour:{
        type:Number
    },
    images: {
        type: [String]
    },
    likes:{
        type: Number
    },
    dislikes:{
        type: Number
    },
    status:{
        type: String
    },
    courts:[{
        name:{
            type: String
        },
        type: {
            type: String
        },
        capacity: {
            type: Number
        },
        sport:{
            type: String
        },
        equipmentDescription:{
            type: String
        },
        status:{
            type: String
        }
    }],
    location: {
        type: {
            type: String
        },
        coordinates: {
            type: [Number]
        }
    },
    maxNoShowsBeforeBlock:{
        type: Number,
        default: 3
    },
    workingHours: {
        open:{
            type: String
        },
        close:{
            type: String
        }
    },
    employees:{
        type: [String]
    },
    trainers:{
        type: [String]
    }
    }
);

export default mongoose.model("FacilityModel", Facility, "facilities");
