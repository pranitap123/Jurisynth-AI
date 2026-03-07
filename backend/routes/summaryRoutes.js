const express = require("express");
const router = express.Router();
// Destructured import to use our session protection and role-checking guards
const { protect, authorize } = require("../middleware/authMiddleware"); 
const { 
  generateSummary, 
  getSummaryByCase 
} = require("../controllers/summaryController");

/**
 * @route   POST /api/summary/:caseId
 * @desc    Triggers AI Conflict Detection & Analysis
 * @access  Private (Advocate Only)
 */
router.post("/:caseId", protect, authorize("advocate"), generateSummary);

/**
 * @route   GET /api/summary/:caseId
 * @desc    Retrieves generated legal insights
 * @access  Private (Advocate & User)
 */
router.get("/:caseId", protect, authorize("advocate", "user"), getSummaryByCase);

module.exports = router;