const Case = require("../models/Case");

exports.createCase = async (req, res) => {
  try {
    const { title, caseNumber, description } = req.body;

    // 1. Check if the Case ID already exists
    // We check globally to ensure Case Numbers remain unique across the platform
    const existingCase = await Case.findOne({ caseNumber });

    if (existingCase) {
      // 2. Return the exact error message requested
      return res.status(400).json({ 
        message: "This case ID already exists. Please enter a different Case ID." 
      });
    }

    const newCase = await Case.create({
      title,
      caseNumber,
      description,
      user: req.user.id
    });

    res.status(201).json(newCase);
  } catch (error) {
    // Handling MongoDB duplicate key error as a fallback
    if (error.code === 11000) {
        return res.status(400).json({ message: "This case ID already exists. Please enter a different Case ID." });
    }
    res.status(500).json({ message: error.message });
  }
};

exports.getCases = async (req, res) => {
  try {
    const cases = await Case.find({ user: req.user.id })
      .populate('documents')
      .sort({ createdAt: -1 });
    res.json(cases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCaseById = async (req, res) => {
  try {
    const caseData = await Case.findById(req.params.id).populate('documents');

    if (!caseData) {
      return res.status(404).json({ message: "Case not found" });
    }

    if (caseData.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(caseData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCase = async (req, res) => {
  try {
    const caseData = await Case.findById(req.params.id);

    if (!caseData) {
      return res.status(404).json({ message: "Case not found" });
    }

    if (caseData.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    // If caseNumber is being updated, check for uniqueness again
    if (req.body.caseNumber && req.body.caseNumber !== caseData.caseNumber) {
        const duplicate = await Case.findOne({ caseNumber: req.body.caseNumber });
        if (duplicate) {
            return res.status(400).json({ message: "This case ID already exists. Please enter a different Case ID." });
        }
    }

    const updatedCase = await Case.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('documents');

    res.json(updatedCase);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCase = async (req, res) => {
  try {
    const caseData = await Case.findById(req.params.id);

    if (!caseData) {
      return res.status(404).json({ message: "Case not found" });
    }

    if (caseData.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    await caseData.deleteOne();

    res.json({ message: "Case deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file was uploaded." });
    }

    const updatedCase = await Case.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { 
        $push: { 
          documents: { 
            filename: req.file.originalname, 
            path: req.file.path 
          } 
        } 
      },
      { new: true, runValidators: true }
    ).populate('documents'); 

    if (!updatedCase) {
      return res.status(404).json({ message: "Case not found or unauthorized" });
    }

    res.status(200).json(updatedCase);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};