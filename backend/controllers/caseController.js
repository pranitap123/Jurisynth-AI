const Case = require("../models/Case");

exports.createCase = async (req, res) => {
  try {
    const { title, caseNumber, description } = req.body;

    const newCase = await Case.create({
      title,
      caseNumber,
      description,
      user: req.user.id
    });

    res.status(201).json(newCase);
  } catch (error) {
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