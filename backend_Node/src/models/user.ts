import mongoose from "mongoose";

const Schema = mongoose.Schema;
let User = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  profileImage: {
    type: String,
    default: 'default-avatar.png'
  },
  role: {
    type: String,
    required: true
  },
  favoriteSports: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    default: 'pending'
  },
  employeeInfo: {
    facilityName: { type: String },
    facilityAddress: { type: String },
    registrationNumber: { type: String },
    pib: { type: String }
  },
  resetToken: {
    type: String,
    default: null
  },
  resetTokenExpires: {
    type: Date,
    default: null
  },
  facilityBlocks: [{
  facilityName: { type: String },
  noShowCount: { type: Number, default: 0 }
  }]
  }
);

export default mongoose.model("UserModel", User, "users");
