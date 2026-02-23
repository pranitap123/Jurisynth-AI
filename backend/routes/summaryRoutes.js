const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const { generateSummary, getSummaryByCase } = require("../controllers/summaryController");

router.post("/", protect, generateSummary);
router.get("/:caseId", protect, getSummaryByCase);

module.exports = router;