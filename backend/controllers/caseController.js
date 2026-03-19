const mongoose = require("mongoose");
const Case = require("../models/Case");


// ✅ CREATE CASE
const createCase = async (req, res) => {
  try {
    const { title, caseNumber, description, status, priority } = req.body;

    // ✅ VALID ENUM VALUES (MATCH SCHEMA)
    const validStatuses = ["processing", "ready", "closed"];
    const validPriorities = ["high", "medium", "low"];

    // ✅ FIX PRIORITY FROM FRONTEND (e.g. "High Priority")
    let formattedPriority = "low";
    if (priority) {
      const p = priority.toLowerCase();
      if (p.includes("high")) formattedPriority = "high";
      else if (p.includes("medium")) formattedPriority = "medium";
      else formattedPriority = "low";
    }

    const newCase = await Case.create({
      title,
      caseNumber,
      description,

      // ✅ STATUS FIX
      status: validStatuses.includes(status) ? status : "processing",

      // ✅ PRIORITY FIX
      priority: validPriorities.includes(priority)
        ? priority
        : formattedPriority,

      documents: [],
      timeline: [],
      stageHistory: [],

      tasks: [
        {
          text: "Upload required documents",
          status: "pending"
        }
      ],

      user: new mongoose.Types.ObjectId()
    });

    res.status(201).json(newCase);

  } catch (error) {
    console.log("❌ CREATE CASE ERROR:", error);

    // ✅ HANDLE DUPLICATE CASE NUMBER
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Case number already exists. Please use a different one."
      });
    }

    res.status(500).json({ message: error.message });
  }
};

// ✅ GET ALL CASES
const getCases = async (req, res) => {
  try {
    const cases = await Case.find();

    const priorityOrder = { high: 1, medium: 2, low: 3 };

    cases.sort((a, b) => {
      const pA = a.priority || "low";
      const pB = b.priority || "low";
      return priorityOrder[pA] - priorityOrder[pB];
    });

    res.json(cases);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET CASE BY ID
const getCaseById = async (req, res) => {
  try {
    const data = await Case.findById(req.params.id);

    if (!data) {
      return res.status(404).json({ message: "Case not found" });
    }

    res.json(data);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ DELETE CASE
const deleteCase = async (req, res) => {
  try {
    await Case.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error deleting case" });
  }
};


// ✅ UPLOAD DOCUMENT
const uploadDocument = async (req, res) => {
  try {
    const caseData = await Case.findById(req.params.id);

    if (!caseData) {
      return res.status(404).json({ message: "Case not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // ✅ PUSH INTO ARRAY
    caseData.documents.push({
      fileName: req.file.originalname,
      fileUrl: req.file.filename,
    });

    // ✅ ADD TIMELINE ENTRY (BONUS 🔥)
    caseData.timeline.push({
      type: "document_uploaded",
      message: `File uploaded: ${req.file.originalname}`,
    });

    await caseData.save();

    res.json(caseData);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error uploading file" });
  }
};
// ✅ GENERATE SUMMARY
const generateSummary = async (req, res) => {
  try {
    const caseData = await Case.findById(req.params.id);

    if (!caseData) {
      return res.status(404).json({ message: "Case not found" });
    }

    caseData.status = "processing";

    caseData.timeline.push({
      type: "summary_generated",
      message: "AI summary generated"
    });

    await caseData.save();

    res.json({ message: "Summary generated" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error generating summary" });
  }
};

// ✅ ADD PROOF
const addProof = async (req, res) => {
  try {
    const { text } = req.body;

    const caseData = await Case.findById(req.params.id);

    if (!caseData) {
      return res.status(404).json({ message: "Case not found" });
    }

    caseData.timeline.push({
      type: "proof_added",
      message: text
    });

    caseData.status = "processing";

    await caseData.save();

    res.json(caseData);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error adding proof" });
  }
};

// ✅ ADD JUDGEMENT
const addJudgement = async (req, res) => {
  try {
    const { judgement } = req.body;

    const caseData = await Case.findById(req.params.id);

    if (!caseData) {
      return res.status(404).json({ message: "Case not found" });
    }

    caseData.timeline.push({
      type: "judgement_added",
      message: judgement
    });

    caseData.status = "ready";

    await caseData.save();

    res.json(caseData);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error adding judgement" });
  }
};

// ✅ CLOSE CASE
const closeCase = async (req, res) => {
  try {
    const caseData = await Case.findById(req.params.id);

    if (!caseData) {
      return res.status(404).json({ message: "Case not found" });
    }

    caseData.status = "closed";

    caseData.timeline.push({
      type: "case_closed",
      message: "Case has been closed"
    });

    await caseData.save();

    res.json(caseData);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error closing case" });
  }
};
module.exports = {
  createCase,
  getCases,
  getCaseById,
  deleteCase,
  generateSummary,
  addProof,
  addJudgement,
  closeCase,
  uploadDocument, // ✅ ADD THIS
};