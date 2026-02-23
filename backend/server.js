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

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/cases", require("./routes/caseRoutes"));
app.use("/api/documents", require("./routes/documentRoutes"));
app.use("/uploads", express.static("uploads"));

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