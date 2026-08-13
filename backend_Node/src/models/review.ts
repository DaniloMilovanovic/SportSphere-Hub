import mongoose from "mongoose";

const Schema = mongoose.Schema;

let Review = new Schema({
    username:{
        type: String
    },
    facilityName: {
        type: String
    },
    type:{
        type: String
    },
    comment: {
        type: String
    },
    createdAt: {
        type: Date
    }
});


export default mongoose.model("ReviewModel", Review, "reviews");