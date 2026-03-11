const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, ".env") });

const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const rateLimiter = require("./middleware/rateLimiter");

const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const analysisRoutes = require("./routes/analysisRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads", "resumes");
fs.mkdirSync(uploadsDir, { recursive: true });

// Database
connectDB();

// CORS - allow both localhost and 127.0.0.1 for the frontend port
const allowedOrigins = [
  process.env.CLIENT_ORIGIN,
  "http://localhost:8080",
  "http://127.0.0.1:8080",
  "http://localhost:5173",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(new Error("CORS policy violation"), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// Request logger to help debug connection issues
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - Origin: ${req.headers.origin}`);
  next();
});

// Security & logging
app.use(helmet());
app.use(morgan("dev"));

// Body parsers
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// Static files for uploaded resumes
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rate limiting (basic global limiter)
app.use(rateLimiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/analyze", analysisRoutes);
app.use("/api/report", reportRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "AI Resume Analyzer backend running" });
});

// Error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${PORT}`);
});

