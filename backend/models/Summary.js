const mongoose = require("mongoose");

const summarySchema = new mongoose.Schema(
  {
    case: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",
      required: true
    },
    summaryText: {
      type: String,
      required: true
    },
    keyPoints: [
      {
        type: String
      }
    ],
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Summary", summarySchema);