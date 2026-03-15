const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String
    },
   role: {
      type: String,
      enum: ["user", "advocate"], 
      default: "user"
    },
    googleId: {
      type: String
    },
    aiSettings: {
      modelPreference: { 
        type: String, 
        default: "Gemini 2.5 Flash" 
      },
      analysisDepth: { 
        type: String, 
        default: "Comprehensive" 
      },
      simulationMode: { 
        type: Boolean, 
        default: false 
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);