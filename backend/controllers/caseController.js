const Case = require("../models/Case");

// Create Case
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

// Get All Cases (Only for logged-in user)
exports.getCases = async (req, res) => {
  try {
    const cases = await Case.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(cases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Case
exports.getCaseById = async (req, res) => {
  try {
    const caseData = await Case.findById(req.params.id);

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

// Update Case
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
    );

    res.json(updatedCase);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Case
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