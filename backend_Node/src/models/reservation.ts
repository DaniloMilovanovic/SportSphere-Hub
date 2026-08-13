import mongoose from "mongoose";

const Schema = mongoose.Schema;

let Reservation = new Schema({
    username:{
        type: String
    },
    facilityName:{
        type: String
    },
    city:{
        type: String
    },
    courtName:{
        type: String
    },
    sport:{
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
    status:{
        type: String
    }

});

export default mongoose.model("ReservationModel", Reservation, "reservations");