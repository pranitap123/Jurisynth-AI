const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware"); 
const { 
  generateSummary, 
  getSummaryByCase 
} = require("../controllers/summaryController");

router.post("/:caseId", protect, authorize("advocate"), generateSummary);

router.get("/:caseId", protect, authorize("advocate", "user"), getSummaryByCase);

module.exports = router;