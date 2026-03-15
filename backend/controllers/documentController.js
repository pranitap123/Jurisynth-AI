const Document = require("../models/Document");
const Case = require("../models/Case");

exports.uploadDocument = async (req, res) => {
  try {
    const { caseId } = req.body;

    const caseData = await Case.findById(caseId);

    if (!caseData) {
      return res.status(404).json({ message: "Case not found" });
    }

    if (caseData.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    const newDocument = await Document.create({
      case: caseId,
      fileName: req.file.filename,
      filePath: req.file.path,
      uploadedBy: req.user.id
    });

    await Case.findByIdAndUpdate(caseId, {
      $push: { documents: newDocument._id }
    });

    res.status(201).json(newDocument);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};