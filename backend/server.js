const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
const protect = require("./middleware/authMiddleware");

app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "Protected route working",
    user: req.user
  });
});
// ... existing imports
const User = require("./models/User"); // DON'T FORGET THIS

// ... existing app.use middleware

// FIX: Move this OUT of app.get("/test")
app.patch('/api/users/settings', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Update the user's aiSettings field
        user.aiSettings = {
            modelPreference: req.body.modelPreference,
            analysisDepth: req.body.analysisDepth,
            simulationMode: req.body.simulationMode
        };

        await user.save();
        res.json({ message: "Settings Updated", settings: user.aiSettings });
    } catch (error) {
        console.error("Settings Update Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// Keep your test routes clean
app.get("/test", (req, res) => {
  res.send("Test route working");
});

// ... rest of the file

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/cases", require("./routes/caseRoutes"));
app.use("/api/documents", require("./routes/documentRoutes"));
app.use("/uploads", express.static("uploads"));
app.use("/api/summary", require("./routes/summaryRoutes"));

app.get("/", (req, res) => {
  res.send("Jurisynth Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

app.get("/test", (req, res) => {
  res.send("Test route working");

  
});