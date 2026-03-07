const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true,
      trim: true 
    },
    caseNumber: { 
      type: String, 
      required: true, 
      unique: true, // This prevents duplicate Case IDs at the database level
      trim: true    // Removes accidental whitespace
    },
    description: { 
      type: String 
    },
    status: {
      type: String,
      enum: ["processing", "ready", "closed"],
      default: "processing"
    },
    aiSummary: {
      type: String,
      default: ""
    },
    keyPoints: {
      type: [String],
      default: []
    },
    documents: [
      {
        filename: String,
        path: String,
        uploadedAt: { type: Date, default: Date.now }
      }
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

// Optional: Create a text index for the search feature
caseSchema.index({ title: 'text', caseNumber: 'text' });

module.exports = mongoose.model("Case", caseSchema);