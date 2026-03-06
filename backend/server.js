const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const connectDB = require("./config/db");
const User = require("./models/User");
const protect = require("./middleware/authMiddleware");

dotenv.config();
connectDB();

const app = express();

app.use(helmet());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:3000", 
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
}));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get('/api/users/settings', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('aiSettings');
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ settings: user.aiSettings });
    } catch (error) {
        res.status(500).json({ message: "Error fetching settings" });
    }
});

app.patch('/api/users/settings', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.aiSettings = {
            modelPreference: req.body.modelPreference || user.aiSettings?.modelPreference,
            analysisDepth: req.body.analysisDepth || user.aiSettings?.analysisDepth,
            simulationMode: req.body.simulationMode ?? user.aiSettings?.simulationMode
        };

        await user.save();
        res.json({ message: "Settings Updated", settings: user.aiSettings });
    } catch (error) {
        console.error("Settings Update Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

app.post("/api/auth/logout", (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0), 
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    });
    res.status(200).json({ message: "Session revoked and token expired" });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/cases", require("./routes/caseRoutes"));
app.use("/api/documents", require("./routes/documentRoutes"));
app.use("/api/summary", require("./routes/summaryRoutes"));

app.get("/api/protected", protect, (req, res) => {
    res.json({ message: "Protected route working", user: req.user });
});

app.get("/test", (req, res) => {
    res.send("Test route working");
});

app.get("/", (req, res) => {
    res.send("Jurisynth Backend Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
);