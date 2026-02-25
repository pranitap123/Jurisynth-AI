const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware"); 

const {
  createCase,
  getCases,
  getCaseById,
  updateCase,
  deleteCase,
  uploadDocument 
} = require("../controllers/caseController");

router.post("/", protect, createCase);
router.get("/", protect, getCases);
router.get("/:id", protect, getCaseById);
router.put("/:id", protect, updateCase);
router.delete("/:id", protect, deleteCase);

router.post("/:id/documents", protect, upload.single("document"), uploadDocument);

module.exports = router;