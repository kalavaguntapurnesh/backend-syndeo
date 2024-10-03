const mongoose = require("mongoose");
const { Schema } = mongoose;

const individualScheduleSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      // type: String,
      // required: true,
    },
    title: {
      type: String,
      // required: true,
    },
    description: {
      type: String,
      // required: true,
    },
    location: {
      type: String,
      // required: true,
    },
    date: {
      type: String,
      // required: true,
    },
    startTime: {
      type: String,
      // required: true,
    },
    endTime: {
      type: String,
      // required: true,
    },
    // guestsEmails: {
    //   type: Array,
    //   requried: true,
    // },
  },
  { timestamps: true }
);

const individualScheduleModel = mongoose.model(
  "IndividualSchedule",
  individualScheduleSchema
);

module.exports = individualScheduleModel;
