const Summary = require("../models/Summary");
const Case = require("../models/Case");

// Mock AI summary for now
exports.generateSummary = async (req, res) => {
  try {
    const { caseId } = req.body;

    const caseData = await Case.findById(caseId);

    if (!caseData) {
      return res.status(404).json({ message: "Case not found" });
    }

    if (caseData.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    // 🔥 Mock AI Output (we will replace with real AI later)
    const summaryText =
      "This case involves a contractual dispute between two parties regarding delivery obligations.";

    const keyPoints = [
      "Contract signed between parties",
      "Delivery deadline missed",
      "Claim for damages filed"
    ];

    const newSummary = await Summary.create({
      case: caseId,
      summaryText,
      keyPoints,
      generatedBy: req.user.id
    });

    // Auto update case status
    caseData.status = "ready";
    await caseData.save();

    res.status(201).json(newSummary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get summary by caseId
exports.getSummaryByCase = async (req, res) => {
  try {
    const summary = await Summary.findOne({ case: req.params.caseId });

    if (!summary) {
      return res.status(404).json({ message: "Summary not found" });
    }

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};