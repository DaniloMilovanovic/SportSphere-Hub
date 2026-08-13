import mongoose from "mongoose";

const Schema = mongoose.Schema;
let Trainer = new Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    specialization: {
        type: String
    },
    facilityName: {
        type: String
    },
    city: {
        type: String
    },
    pricePerHour: {
        type: Number
    },
    averageRating: {
        type: Number
    },
    totalReviews: {
        type: Number
    },
    status: {
        type: String
    }
});

export default mongoose.model("TrainerModel", Trainer, "trainers");