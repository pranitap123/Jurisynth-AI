const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    caseNumber: { type: String, required: true, unique: true },
    description: String,

    status: {
      type: String,
      default: "processing",
    },

    priority: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "medium",
    },

    // ✅ ADD THIS (FIX)
    documents: [
      {
        fileName: String,
        fileUrl: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    timeline: [
      {
        type: { type: String },
        message: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    stageHistory: [],

    tasks: [
      {
        text: String,
        status: String,
      },
    ],

    user: mongoose.Schema.Types.ObjectId,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Case", caseSchema);