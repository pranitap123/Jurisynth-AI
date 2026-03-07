const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan"); // Added for logging
const rateLimit = require("express-rate-limit"); // Added for security
const connectDB = require("./config/db");
const User = require("./models/User");
const protect = require("./middleware/authMiddleware");

dotenv.config();
connectDB();

const app = express();

// 1. SECURITY & LOGGING MIDDLEWARE
app.use(helmet({
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }, // Required for Google Auth
    contentSecurityPolicy: false, 
}));

app.use(morgan("dev")); // Logs every request to the terminal
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:3000", 
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true // Crucial for HttpOnly Cookies
}));

// 2. RATE LIMITING (Prevents DDoS and AI cost spikes)
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: { message: "Too many requests, please try again later." }
});
app.use("/api/", apiLimiter);

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 3. SETTINGS ROUTES
app.get('/api/users/settings', protect, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('aiSettings');
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ settings: user.aiSettings });
    } catch (error) {
        next(error); // Pass to global error handler
    }
});

app.patch('/api/users/settings', protect, async (req, res, next) => {
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
        next(error);
    }
});

// 4. AUTH & APP ROUTES
app.post("/api/auth/logout", (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0), 
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    });
    res.status(200).json({ message: "Session revoked" });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/cases", require("./routes/caseRoutes"));
app.use("/api/documents", require("./routes/documentRoutes"));
app.use("/api/summary", require("./routes/summaryRoutes"));

// 5. GLOBAL ERROR HANDLER (Catches all 'next(error)' calls)
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    console.error(`[ERROR] ${err.message}`);
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Jurisynth Backend running on port ${PORT}`));