const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware"); // NEW: Import multer config

const {
  createCase,
  getCases,
  getCaseById,
  updateCase,
  deleteCase,
  uploadDocument // NEW: Import the upload controller
} = require("../controllers/caseController");

router.post("/", protect, createCase);
router.get("/", protect, getCases);
router.get("/:id", protect, getCaseById);
router.put("/:id", protect, updateCase);
router.delete("/:id", protect, deleteCase);

// NEW: The upload route. Note the 'upload.single("document")' middleware
router.post("/:id/documents", protect, upload.single("document"), uploadDocument);

module.exports = router;