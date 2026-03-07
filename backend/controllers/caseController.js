const Case = require("../models/Case");
const User = require("../models/User");

/**
 * @desc    Create a new legal case
 * @route   POST /api/cases
 * @access  Private (Advocate Only via Route Guard)
 */
exports.createCase = async (req, res) => {
  try {
    const { title, caseNumber, description } = req.body;

    const existingCase = await Case.findOne({ caseNumber });
    if (existingCase) {
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
    if (error.code === 11000) {
        return res.status(400).json({ message: "This case ID already exists. Please enter a different Case ID." });
    }
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get all cases authorized for the logged-in user
 * @route   GET /api/cases
 * @access  Private
 * UPDATED: Allows standard users to see all cases while advocates see only theirs
 */
exports.getCases = async (req, res) => {
  try {
    let query = {};

    // If advocate, show only cases they created. If user, show all.
    if (req.user.role === 'advocate') {
      query = { user: req.user.id };
    }

    const cases = await Case.find(query)
      .populate('documents')
      .sort({ createdAt: -1 });

    let userName = req.user.name;
    let userRole = req.user.role;

    if (!userName || !userRole) {
      const dbUser = await User.findById(req.user.id);
      if (dbUser) {
        userName = dbUser.name;
        userRole = dbUser.role;
      }
    }

    res.json({
      cases: cases || [],
      user: {
        name: userName || "User",
        role: userRole || "user"
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get single case details
 * @route   GET /api/cases/:id
 * UPDATED: Allows 'user' role to bypass ownership check for viewing
 */
exports.getCaseById = async (req, res) => {
  try {
    const caseData = await Case.findById(req.params.id).populate('documents');

    if (!caseData) {
      return res.status(404).json({ message: "Case not found" });
    }

    // Security check: Only block if NOT an advocate and NOT a authorized user
    if (req.user.role === 'advocate' && caseData.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(caseData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update case details
 * @route   PUT /api/cases/:id
 * SECURITY: Still restricts updates to the original creator (Advocate)
 */
exports.updateCase = async (req, res) => {
  try {
    const caseData = await Case.findById(req.params.id);

    if (!caseData) {
      return res.status(404).json({ message: "Case not found" });
    }

    // Only the creator (advocate) can update the case
    if (caseData.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied. Only the assigned advocate can update this case." });
    }

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

/**
 * @desc    Delete a case
 * @route   DELETE /api/cases/:id
 */
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

/**
 * @desc    Upload document to specific case
 */
exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file was uploaded." });
    }

    // Standard users can view but should usually not upload to an advocate's case unless authorized
    const query = { _id: req.params.id };
    if (req.user.role === 'advocate') {
      query.user = req.user.id;
    }

    const updatedCase = await Case.findOneAndUpdate(
      query,
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