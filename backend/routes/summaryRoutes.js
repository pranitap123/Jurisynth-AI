const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { 
  generateSummary, 
  getSummaryByCase 
} = require("../controllers/summaryController");

/**
 * @route   POST /api/summary/:caseId
 * @desc    Triggers the AI analysis pipeline (Text extraction -> Gemini -> Save to DB)
 * @access  Private
 */
router.post("/:caseId", protect, generateSummary);

/**
 * @route   GET /api/summary/:caseId
 * @desc    Retrieves the already generated AI summary and key points
 * @access  Private
 */
router.get("/:caseId", protect, getSummaryByCase);

module.exports = router;