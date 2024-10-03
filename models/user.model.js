const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    middleName: { type: String },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    selectedCountry: {
      type: Object,
    },
    selectedState: {
      type: Object,
    },
    selectedCity: {
      type: Object,
    },
    phoneNumber: {
      type: String,
      default: "",
    },
    streetName: {
      type: String,
      default: "",
    },
    gender: {
      type: Object,
    },
    postalCode: {
      type: String,
      default: "",
    },
    profileImage: {
      type: String,
    },
    role: {
      type: String,
      enum: ["individual", "organization", "employee"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
