const express = require("express");
const router = express.Router();

const caseController = require("../controllers/caseController");
const upload = require("../middleware/uploadMiddleware.js"); // ✅ ADD

// Create case
router.post("/", caseController.createCase);

// Get all cases
router.get("/", caseController.getCases);

// Get single case
router.get("/:id", caseController.getCaseById);

// Delete case
router.delete("/:id", caseController.deleteCase);

// AI summary
router.put("/:caseId/summary", caseController.generateSummary);

// ✅ ✅ ✅ MAIN FIX (UPLOAD ROUTE HERE)
router.post(
  "/upload/:id",
  upload.single("file"),
  caseController.uploadDocument
);

module.exports = router;