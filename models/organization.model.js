const mongoose = require("mongoose");
const { Schema } = mongoose;

const organizationSchema = new mongoose.Schema(
  {
    organizationAdminId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    organizationName: {
      type: String,
    },
    organizationCountry: {
      type: Object,
    },
    organizationState: {
      type: Object,
    },
    organizationCity: {
      type: Object,
    },
  },
  { timestamps: true }
);

const organizationModel = mongoose.model("Organization", organizationSchema);

module.exports = organizationModel;
