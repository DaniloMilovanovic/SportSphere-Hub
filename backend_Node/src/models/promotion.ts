import mongoose from "mongoose";

const Schema = mongoose.Schema;
let Promotion = new Schema({
    facilityName:{
        type: String
    },
    name:{
        type: String,
    },
    description:{
        type: String
    },
    discountType:{
        type:String
    },
    discountValue:{
        type: Number
    },
    sports:{
        type: [String]
    },
    validFrom:{
        type:Date
    },
    validTo:{
        type:Date
    },
    status:{
        type:String
    }
});

export default mongoose.model("PromotionModel", Promotion, "promotions");