const mongoose = require("mongoose");

const { Schema } = mongoose;

const organizerSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
    },
    officeStartTime: {
      type: String,
      default: "",
    },
    officeEndTime: {
      type: String,
      default: "",
    },
    organizationName: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    organizationAdminId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const organizerModel = mongoose.model("Organizer", organizerSchema);

module.exports = organizerModel;
