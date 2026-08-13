import mongoose from "mongoose";

const Schema = mongoose.Schema;

let Advertisement = new Schema({
    authorUsername: {
        type: String
    },
    sport:{
        type: String
    },
    city:{
        type: String
    },
    date:{
        type: Date
    },
    startTime:{
        type: String
    },
    endTime:{
        type: String 
    },
    missingPlayers:{
        type: Number
    },
    status:{
        type: String
    },
    requests: [
        {
            username:{
                type: String
            },
            status:{
                type: String
            },
            requestDate:{
                type: Date
            }
        }
    ],
    createdAt:{
        type: Date
    }
});

export default mongoose.model("AdvertisementModel", Advertisement, "advertisements");