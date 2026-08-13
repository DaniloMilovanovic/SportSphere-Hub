import mongoose from "mongoose";

const Schema = mongoose.Schema;
let Sport = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
});

export default mongoose.model("SportModel", Sport, "sports");