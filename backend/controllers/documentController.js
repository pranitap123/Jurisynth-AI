const Case = require("../models/Case");

exports.uploadDocument = async (req, res) => {
  try {
    const { caseId } = req.params;

    const caseData = await Case.findOne({
      $or: [
        { _id: caseId.match(/^[0-9a-fA-F]{24}$/) ? caseId : null },
        { caseNumber: caseId }
      ]
    });

    if (!caseData) {
      return res.status(404).json({ message: "Case not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    caseData.documents.push({
      filename: req.file.originalname,
      path: req.file.path
    });

    caseData.timeline.push({
      type: "document_uploaded",
      message: `Uploaded: ${req.file.originalname}`
    });

    caseData.stage = "documents_uploaded";

    await caseData.save();

    res.status(200).json({ message: "File uploaded successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};