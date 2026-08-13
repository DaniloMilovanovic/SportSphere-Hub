import mongoose from "mongoose";

const Schema = mongoose.Schema;

let Equipment = new Schema({
    name:{
        type: String
    },
    category:{
        type: String
    },
    price:{
        type: Number
    },
    image:{
        type: String
    },
    stock:{
        type: Number
    }

});

export default mongoose.model("EquipmentModel", Equipment, "equipment");