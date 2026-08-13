import mongoose from "mongoose";

const Schema = mongoose.Schema;

let TrainingSession = new Schema({
    athleteUsername: {
        type: String
    },
    trainerId: {
        type: String
    },
    trainerFirstName: {
        type: String
    },
    trainerLastName:{
        type: String
    },
    sport: {
        type: String
    },
    facilityName: {
        type: String
    },
    city: {
        type: String
    },
    courtName:{
        type: String
    },
    date: {
        type: Date
    },
    startTime: {
        type: String
    },
    endTime: {
        type: String
    },
    pricePerHour: {
        type: Number
    },
    totalPrice: {
        type: Number
    },
    status: {
        type: String
    }
});

export default mongoose.model("TrainingSessionModel", TrainingSession, "trainingSessions");