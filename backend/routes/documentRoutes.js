const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { uploadDocument } = require("../controllers/documentController");

// ✅ ADD caseId in URL
router.post("/:caseId", protect, upload.single("file"), uploadDocument);

module.exports = router;