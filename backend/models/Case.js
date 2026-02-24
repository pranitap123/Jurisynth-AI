const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema(
{
title: { type: String, required: true },
caseNumber: { type: String, required: true },
description: { type: String },
status: {
type: String,
enum: ["processing", "ready", "closed"],
default: "processing"
},
// AI Generated Fields
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

module.exports = mongoose.model("Case", caseSchema);