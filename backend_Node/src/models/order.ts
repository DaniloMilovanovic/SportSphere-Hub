import mongoose from "mongoose";

const Schema = mongoose.Schema;

let Item = new Schema({
    equipmentName:{
        type: String
    },
    quantity:{
        type: Number
    },
    price:{
        type: Number
    }
})

let Order = new Schema({
    username:{
        type: String
    },
    items: [Item],
    totalAmount:{
        type: Number
    },
    status:{
        type: String
    }
}, {
    timestamps: true
});

export default mongoose.model("OrderModel", Order, "orders");